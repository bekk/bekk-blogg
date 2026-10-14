// serverless function for handling webhooks

import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { waitUntil } from '@vercel/functions'
import algoliasearch from 'algoliasearch'
import OpenAI from 'openai'
import { ActionFunction } from 'react-router'
import indexer from 'sanity-algolia'
import { POST_SEARCH_PROJECTION } from '../../utils/sanity/queries/postQueries'
import { readClient, writeClient } from '../../utils/sanity/sanity.server'
import { deletePostSummary, generatePostSummary } from '../../utils/summary/postSummary.server'
import { deletePostAudio, generatePostAudio } from '../../utils/tts/postAudio.server'
import { mapWithConcurrency } from '../../utils/tts/synthesize'

// Webhooken kommer rett etter publisering, så CDN-en kan ha gammelt innhold
const syncClient = readClient.withConfig({ useCdn: false })

type WebhookBody = { ids: { created: string[]; updated: string[]; deleted: string[] } }

const published = (id: string) => !id.startsWith('drafts.') && !id.startsWith('versions.')

const createOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set, skipping AI generation')
    return null
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 4 })
}

/**
 * Genererer opplesninger for publiserte artikler som er endret, og sletter dem for
 * slettede innlegg. Hashen gjør at innlegg der teksten er uendret (f.eks. etter et
 * like-klikk) hoppes over, så det er trygt å kalle for alle endringer.
 */
async function syncPostAudio({ ids }: WebhookBody) {
  // Sletting trenger ikke OpenAI, så det gjøres uansett
  for (const id of ids.deleted.filter(published)) {
    await deletePostAudio(id, writeClient).catch((error) => {
      console.error('Could not delete audio for post', id, error)
    })
  }

  const openai = createOpenAI()
  if (!openai) {
    return
  }
  const changedIds = [...ids.created, ...ids.updated].filter(published)
  // Stemmen velges ut fra første forfatter, så endres en forfatter, må innleggene
  // deres sjekkes også. Hashen gjør at bare de der stemmegrunnlaget faktisk er endret,
  // genereres på nytt.
  const postsByChangedAuthors = await writeClient.fetch<string[]>(
    `*[_type == "post" && authors[0]._ref in *[_type == "author" && _id in $ids]._id]._id`,
    { ids: changedIds },
    { perspective: 'published', useCdn: false }
  )
  const changed = [...new Set([...changedIds, ...postsByChangedAuthors])]

  await mapWithConcurrency(changed, 2, async (id) => {
    try {
      const result = await generatePostAudio(id, { sanity: writeClient, openai })
      if (!['not-article', 'not-eligible', 'unchanged'].includes(result.status)) {
        console.info('Audio for post', id, result)
      }
    } catch (error) {
      console.error('Could not generate audio for post', id, error)
    }
  })
}

/**
 * Genererer «Kort fortalt» for publiserte artikler som er endret, og sletter det
 * for slettede innlegg. Som for opplesningene hoppes uendrede innlegg over.
 */
async function syncPostSummaries({ ids }: WebhookBody) {
  for (const id of ids.deleted.filter(published)) {
    await deletePostSummary(id, writeClient).catch((error) => {
      console.error('Could not delete summary for post', id, error)
    })
  }

  const openai = createOpenAI()
  if (!openai) {
    return
  }
  const changed = [...ids.created, ...ids.updated].filter(published)
  await mapWithConcurrency(changed, 4, async (id) => {
    try {
      const result = await generatePostSummary(id, { sanity: writeClient, openai })
      if (!['not-article', 'not-eligible', 'unchanged'].includes(result.status)) {
        console.info('Summary for post', id, result)
      }
    } catch (error) {
      console.error('Could not generate summary for post', id, error)
    }
  })
}

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices, and generates
 *  pre-recorded audio and summaries for articles.
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  if (typeof signature !== 'string') {
    return new Response('Missing or malformed signature', { status: 400 })
  }

  if (!request.body) {
    return new Response('Missing body', { status: 400 })
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    // Uten hemmelighet kan hvem som helst signere med en tom nøkkel, så avvis alt
    console.error('SANITY_WEBHOOK_SECRET is not set, rejecting webhook')
    return new Response('Webhook not configured', { status: 500 })
  }

  const body = await request.text()
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid signature', { status: 401 })
  }

  const algolia = algoliasearch(process.env.ALGOLIA_APP_ID ?? '', process.env.ALGOLIA_ADMIN_API_KEY ?? '')
  const algoliaIndex = algolia.initIndex(process.env.ALGOLIA_INDEX ?? '')

  const sanityAlgolia = indexer(
    {
      post: {
        index: algoliaIndex,
        projection: POST_SEARCH_PROJECTION,
      },
    },
    (post) => ({ ...post, availableFromMillis: new Date(post.availableFrom).getTime() })
  )
  const payload: WebhookBody = JSON.parse(body)
  // Svarer før lyden og sammendragene er ferdige, så Sanity ikke gir opp og sender
  // webhooken på nytt. De kjøres hver for seg, så sammendragene ikke venter på lyden.
  waitUntil(syncPostAudio(payload))
  waitUntil(syncPostSummaries(payload))

  try {
    await sanityAlgolia.webhookSync(syncClient, payload)
    return new Response('OK', { status: 200 })
  } catch (e) {
    console.error('Error sending data to algolia', e)
    return new Response('Something went wrong', { status: 500 })
  }
}
