import type { SanityClient } from '@sanity/client'
import { createHash } from 'node:crypto'
import type OpenAI from 'openai'

import {
  getInstructions,
  getSpokenText,
  type PreferredVoice,
  resolveVoice,
  synthesize,
  TTS_CHUNK_SIZE,
  TTS_MODEL,
  TTS_VERSION,
  type Voice,
} from './synthesize'
import { isDoorDate } from '../calendar'

/** Bare artikler fra og med denne datoen får opplesning. Eldre artikler vises uten avspiller. */
export const AUDIO_FROM_DATE = '2024-01-01'

/** Om et innlegg skal ha opplesning, ut fra datoen */
export const isAudioEligible = (availableFrom: string | null | undefined) =>
  Boolean(availableFrom && availableFrom >= AUDIO_FROM_DATE && isDoorDate(availableFrom))

/** Fast id per innlegg, så det alltid finnes maks én opplesning */
export const getAudioDocumentId = (postId: string) => `audio-${postId}`

export type AudioSource = {
  _id: string
  title: string | null
  slug: string | null
  availableFrom: string | null
  description: string | null
  content: string | null
  language: string | null
  authorName: string | null
  preferredVoice: PreferredVoice | null
}

type StoredAudio = {
  sourceHash: string | null
  voice: Voice | null
  assetId: string | null
  voiceKey: string | null
}

const AUDIO_SOURCE_QUERY = `*[_type == "post" && type == "article" && _id == $id][0] {
  _id,
  title,
  "slug": slug.current,
  availableFrom,
  "description": pt::text(description),
  "content": pt::text(content),
  language,
  "authorName": authors[0]->fullName,
  "preferredVoice": authors[0]->preferredVoice
}`

const STORED_AUDIO_QUERY = `*[_id == $id][0] {
  sourceHash,
  voice,
  voiceKey,
  "assetId": audio.asset._ref
}`

/** Det som avgjør stemmevalget. Endres det, velges stemmen på nytt. */
const getVoiceKey = (source: AudioSource) => `${source.preferredVoice ?? 'none'}:${source.authorName ?? ''}`

/**
 * Hash av alt som påvirker lyden. Stemmen som gjettes ut fra navnet er ikke med,
 * siden svaret kan variere – i stedet er det det stemmen er basert på.
 */
export function getSourceHash(source: AudioSource, text: string) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        version: TTS_VERSION,
        model: TTS_MODEL,
        chunkSize: TTS_CHUNK_SIZE,
        instructions: getInstructions(source.language),
        voiceKey: getVoiceKey(source),
        text,
      })
    )
    .digest('hex')
}

export type AudioResult =
  | { status: 'not-article' }
  | { status: 'not-eligible' }
  | { status: 'empty' }
  | { status: 'unchanged' }
  | { status: 'stale' }
  | { status: 'dry-run'; characters: number }
  | { status: 'generated'; characters: number; bytes: number; voice: Voice }

type Options = {
  sanity: SanityClient
  openai: OpenAI
  /** Generer selv om hashen er uendret */
  force?: boolean
  /** Bare regn ut hva som ville skjedd, uten å kalle OpenAI eller skrive til Sanity */
  dryRun?: boolean
}

export const fetchAudioSource = (sanity: SanityClient, postId: string) =>
  sanity.fetch<AudioSource | null>(AUDIO_SOURCE_QUERY, { id: postId }, { perspective: 'published', useCdn: false })

/**
 * Genererer og lagrer opplesningen av et publisert innlegg, hvis teksten har
 * endret seg siden sist. Trygg å kalle flere ganger for samme innlegg.
 */
export async function generatePostAudio(postId: string, options: Options): Promise<AudioResult> {
  const { sanity, openai, force = false, dryRun = false } = options
  const audioId = getAudioDocumentId(postId)

  const source = await fetchAudioSource(sanity, postId)
  if (!source) {
    return { status: 'not-article' }
  }
  // Datogrensa ligger her, så skriptet og webhooken alltid er enige
  if (!isAudioEligible(source.availableFrom)) {
    return { status: 'not-eligible' }
  }
  const text = getSpokenText(source)
  if (!text) {
    return { status: 'empty' }
  }

  const sourceHash = getSourceHash(source, text)
  const stored = await sanity.fetch<StoredAudio | null>(STORED_AUDIO_QUERY, { id: audioId }, { useCdn: false })
  if (!force && stored?.sourceHash === sourceHash) {
    return { status: 'unchanged' }
  }
  if (dryRun) {
    return { status: 'dry-run', characters: text.length }
  }

  // Gjenbruk stemmen hvis det den er basert på er uendret, så den ikke bytter
  // kjønn mellom genereringer
  const voiceKey = getVoiceKey(source)
  const voice =
    stored?.voice && stored.voiceKey === voiceKey
      ? stored.voice
      : await resolveVoice(openai, { authorName: source.authorName, preferredVoice: source.preferredVoice })

  const audio = await synthesize(openai, { text, voice, language: source.language })

  // Er innlegget endret mens vi genererte, er en nyere generering på vei. Kast denne.
  const current = await fetchAudioSource(sanity, postId)
  if (!current || getSourceHash(current, getSpokenText(current)) !== sourceHash) {
    return { status: 'stale' }
  }

  const asset = await sanity.assets.upload('file', audio, {
    filename: `${source.slug ?? postId}.mp3`,
    contentType: 'audio/mpeg',
  })
  await sanity.createOrReplace({
    _id: audioId,
    _type: 'postAudio',
    post: { _type: 'reference', _ref: postId, _weak: true },
    audio: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
    voice,
    voiceKey,
    sourceHash,
    characters: text.length,
    generatedAt: new Date().toISOString(),
  })

  // Den gamle lydfila slettes først når den nye er på plass
  if (stored?.assetId && stored.assetId !== asset._id) {
    await sanity.delete(stored.assetId).catch((error) => {
      console.warn('Could not delete previous audio asset', stored.assetId, error)
    })
  }

  return { status: 'generated', characters: text.length, bytes: audio.length, voice }
}

/** Sletter opplesningen og lydfila når et innlegg slettes */
export async function deletePostAudio(postId: string, sanity: SanityClient) {
  const audioId = getAudioDocumentId(postId)
  const stored = await sanity.fetch<StoredAudio | null>(STORED_AUDIO_QUERY, { id: audioId }, { useCdn: false })
  if (!stored) {
    return
  }
  await sanity.delete(audioId)
  if (stored.assetId) {
    await sanity.delete(stored.assetId).catch((error) => {
      console.warn('Could not delete audio asset', stored.assetId, error)
    })
  }
}
