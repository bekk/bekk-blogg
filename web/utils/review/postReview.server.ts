import type { SanityClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'
import type OpenAI from 'openai'

import { getOsloDate } from '../calendar'
import { portableTextToMarkdown } from '../markdown'
import { extractLinks, findDeadLinks } from './links'
import { REVIEW_MODEL, reviewPost } from './review'

type PortableText = Parameters<typeof portableTextToMarkdown>[0]

/**
 * Fast id per innlegg, så det bare finnes én tilbakemelding. Punktumet gjør
 * dokumentet privat: datasettet er offentlig, men dokumenter med punktum i id-en
 * kan bare leses med token. Tilbakemeldingen siterer upubliserte utkast.
 */
export const getReviewDocumentId = (documentId: string) => `review.${getPublishedId(documentId)}`

const getPublishedId = (documentId: string) => documentId.replace(/^drafts\./, '')

type ReviewSource = {
  _id: string
  title: string | null
  language: string | null
  description: PortableText
  content: PortableText
  relatedLinks: Array<{ url?: string | null } | null> | null
  reviewRequestedAt: string | null
}

const REVIEW_SOURCE_QUERY = `*[_type == "post" && _id == $id][0] {
  _id,
  title,
  language,
  description,
  content,
  relatedLinks,
  reviewRequestedAt
}`

export type ReviewDecision = 'review' | 'stale' | 'already-reviewed'

/**
 * Om en forespørsel skal besvares. Webhooken kan komme flere ganger, og et nytt
 * utkast av et publisert innlegg arver det gamle tidsstempelet, så vi svarer bare
 * på forespørsler som er nye og fortsatt gjelder.
 */
export function getReviewDecision(
  requestedAt: string | null | undefined,
  current: string | null | undefined,
  answered: string | null | undefined
): ReviewDecision {
  if (!requestedAt || current !== requestedAt) {
    return 'stale'
  }
  if (answered && answered >= requestedAt) {
    return 'already-reviewed'
  }
  return 'review'
}

export type ReviewResult =
  | { status: 'not-found' }
  | { status: ReviewDecision }
  | { status: 'reviewed'; items: number; deadLinks: number }
  | { status: 'failed'; error: string }

type Options = {
  sanity: SanityClient
  openai: OpenAI
}

const withKeys = <T extends object>(items: T[]) => items.map((item) => ({ _key: randomUUID().slice(0, 12), ...item }))

const fetchAnsweredAt = (sanity: SanityClient, reviewId: string) =>
  sanity.fetch<string | null>(`*[_id == $id][0].requestedAt`, { id: reviewId }, { perspective: 'raw', useCdn: false })

/**
 * Gir tilbakemelding på et utkast (eller et publisert innlegg) og lagrer den i
 * `review.<postId>`. Feil lagres også, så Studio ikke venter for evig.
 */
export async function generatePostReview(
  documentId: string,
  requestedAt: string | null | undefined,
  { sanity, openai }: Options
): Promise<ReviewResult> {
  const reviewId = getReviewDocumentId(documentId)
  const source = await sanity.fetch<ReviewSource | null>(
    REVIEW_SOURCE_QUERY,
    { id: documentId },
    { perspective: 'raw', useCdn: false }
  )
  if (!source) {
    return { status: 'not-found' }
  }

  const decision = getReviewDecision(requestedAt, source.reviewRequestedAt, await fetchAnsweredAt(sanity, reviewId))
  if (decision !== 'review') {
    return { status: decision }
  }

  const base = {
    _id: reviewId,
    _type: 'postReview',
    post: { _type: 'reference', _ref: getPublishedId(documentId), _weak: true },
    requestedAt: source.reviewRequestedAt,
    model: REVIEW_MODEL,
  }

  const markdown = [portableTextToMarkdown(source.description), portableTextToMarkdown(source.content)]
    .filter(Boolean)
    .join('\n\n')

  try {
    const [review, deadLinks] = await Promise.all([
      reviewPost(openai, { title: source.title, markdown, language: source.language, today: getOsloDate() }),
      findDeadLinks(extractLinks(markdown, source.relatedLinks ?? [])),
    ])
    // En nyere forespørsel kan ha blitt ferdig mens vi jobbet. Da skal ikke denne overskrive den.
    if (getReviewDecision(requestedAt, requestedAt, await fetchAnsweredAt(sanity, reviewId)) !== 'review') {
      return { status: 'stale' }
    }
    await sanity.createOrReplace({
      ...base,
      status: 'done',
      summary: review.summary,
      strengths: review.strengths,
      items: withKeys(review.items),
      deadLinks: withKeys(deadLinks),
      generatedAt: new Date().toISOString(),
    })
    return { status: 'reviewed', items: review.items.length, deadLinks: deadLinks.length }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await sanity.createOrReplace({ ...base, status: 'failed', error: message, generatedAt: new Date().toISOString() })
    return { status: 'failed', error: message }
  }
}
