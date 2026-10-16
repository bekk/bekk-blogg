import { waitUntil } from '@vercel/functions'
import OpenAI from 'openai'
import { ActionFunction } from 'react-router'
import { z } from 'zod'

import { generatePostReview } from '../../utils/review/postReview.server'
import { writeClient } from '../../utils/sanity/sanity.server'
import { readSanityWebhook } from '../../utils/sanity/webhook.server'

const PayloadSchema = z.object({
  id: z.string(),
  requestedAt: z.string().nullish(),
})

/**
 * Tar imot webhooken som Sanity sender når en forfatter trykker «Be om
 * tilbakemelding» i Studio, og lager tilbakemeldingen i bakgrunnen. Se
 * utils/review og dokumentaksjonen i sanity/actions.
 */
export const action: ActionFunction = async ({ request }) => {
  const webhook = await readSanityWebhook(request)
  if ('error' in webhook) {
    return webhook.error
  }

  const payload = PayloadSchema.safeParse(JSON.parse(webhook.body))
  if (!payload.success) {
    return new Response('Invalid payload', { status: 400 })
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set, cannot review post')
    return new Response('Not configured', { status: 500 })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 2 })
  const { id, requestedAt } = payload.data
  // Svarer med en gang, så Sanity ikke gir opp og sender webhooken på nytt
  waitUntil(
    generatePostReview(id, requestedAt, { sanity: writeClient, openai })
      .then((result) => console.info('Review for post', id, result))
      .catch((error) => console.error('Could not review post', id, error))
  )
  return new Response('OK', { status: 202 })
}
