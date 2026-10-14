import type { SanityClient } from '@sanity/client'
import { createHash } from 'node:crypto'
import type OpenAI from 'openai'

import { isDoorDate } from '../calendar'
import { getSpokenText } from '../tts/synthesize'
import {
  getSummaryInstructions,
  summarize,
  SUMMARY_MODEL,
  SUMMARY_REASONING_EFFORT,
  SUMMARY_VERSION,
} from './summarize'

/** Korte artikler er raske å skumme, så der gir ikke et sammendrag noe */
export const SUMMARY_MIN_WORDS = 300

/** Om et innlegg skal ha sammendrag. Gjelder alle luke-datoer, siden det er billig. */
export const isSummaryEligible = (source: Pick<SummarySource, 'availableFrom' | 'hidden'>, text: string) =>
  Boolean(source.availableFrom && isDoorDate(source.availableFrom)) &&
  !source.hidden &&
  text.split(/\s+/).length >= SUMMARY_MIN_WORDS

/** Fast id per innlegg, så det alltid finnes maks ett sammendrag */
export const getSummaryDocumentId = (postId: string) => `summary-${postId}`

export type SummarySource = {
  _id: string
  title: string | null
  availableFrom: string | null
  description: string | null
  content: string | null
  language: string | null
  /** Redaksjonen har skjult «Kort fortalt» for innlegget */
  hidden: boolean | null
}

const SUMMARY_SOURCE_QUERY = `*[_type == "post" && type == "article" && _id == $id][0] {
  _id,
  title,
  availableFrom,
  "description": pt::text(description),
  "content": pt::text(content),
  language,
  "hidden": summaryOverride.hide
}`

/** Hash av alt som påvirker sammendraget. Overstyringen er ikke med, den slås sammen ved visning. */
export function getSummarySourceHash(source: SummarySource, text: string) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        version: SUMMARY_VERSION,
        model: SUMMARY_MODEL,
        reasoningEffort: SUMMARY_REASONING_EFFORT,
        instructions: getSummaryInstructions(source.language),
        text,
      })
    )
    .digest('hex')
}

export type SummaryResult =
  | { status: 'not-article' }
  | { status: 'not-eligible' }
  | { status: 'removed' }
  | { status: 'unchanged' }
  | { status: 'stale' }
  | { status: 'dry-run'; characters: number }
  | { status: 'generated'; characters: number }

type Options = {
  sanity: SanityClient
  openai: OpenAI
  /** Generer selv om hashen er uendret */
  force?: boolean
  /** Bare regn ut hva som ville skjedd, uten å kalle OpenAI eller skrive til Sanity */
  dryRun?: boolean
}

const fetchSummarySource = (sanity: SanityClient, postId: string) =>
  sanity.fetch<SummarySource | null>(SUMMARY_SOURCE_QUERY, { id: postId }, { perspective: 'published', useCdn: false })

/**
 * Genererer og lagrer «Kort fortalt» for et publisert innlegg, hvis teksten har
 * endret seg siden sist. Trygg å kalle flere ganger for samme innlegg.
 */
export async function generatePostSummary(postId: string, options: Options): Promise<SummaryResult> {
  const { sanity, openai, force = false, dryRun = false } = options
  const summaryId = getSummaryDocumentId(postId)

  const source = await fetchSummarySource(sanity, postId)
  const text = source ? getSpokenText(source) : ''
  if (!source || !isSummaryEligible(source, text)) {
    // Er innlegget skjult, flyttet ut av kalenderen eller ikke lenger en artikkel,
    // skal ikke det gamle sammendraget ligge igjen
    if (!dryRun && (await deletePostSummary(postId, sanity))) {
      return { status: 'removed' }
    }
    return { status: source ? 'not-eligible' : 'not-article' }
  }

  const sourceHash = getSummarySourceHash(source, text)
  const stored = await sanity.fetch<{ sourceHash: string | null } | null>(
    `*[_id == $id][0]{ sourceHash }`,
    { id: summaryId },
    { useCdn: false }
  )
  if (!force && stored?.sourceHash === sourceHash) {
    return { status: 'unchanged' }
  }
  if (dryRun) {
    return { status: 'dry-run', characters: text.length }
  }

  const summary = await summarize(openai, { text, language: source.language })

  // Er innlegget endret mens vi genererte, er en nyere generering på vei. Kast denne.
  const current = await fetchSummarySource(sanity, postId)
  if (!current || current.hidden || getSummarySourceHash(current, getSpokenText(current)) !== sourceHash) {
    return { status: 'stale' }
  }

  await sanity.createOrReplace({
    _id: summaryId,
    _type: 'postSummary',
    post: { _type: 'reference', _ref: postId, _weak: true },
    ...summary,
    model: SUMMARY_MODEL,
    sourceHash,
    generatedAt: new Date().toISOString(),
  })
  return { status: 'generated', characters: text.length }
}

/** Sletter sammendraget, f.eks. når et innlegg slettes. Gir `true` hvis det fantes et. */
export async function deletePostSummary(postId: string, sanity: SanityClient) {
  const summaryId = getSummaryDocumentId(postId)
  const exists = await sanity.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id: summaryId }, { useCdn: false })
  if (!exists) {
    return false
  }
  await sanity.delete(summaryId)
  return true
}
