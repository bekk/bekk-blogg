// serverless function for handling webhooks

import { ActionFunction } from '@remix-run/node'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import algoliasearch from 'algoliasearch'
import indexer from 'sanity-algolia'

import { POST_SEARCH_PROJECTION } from '../../utils/sanity/queries/postQueries'
import { readClient } from '../../utils/sanity/sanity.server'

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
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

  const body = await request.text()
  if (!(await isValidSignature(body, signature, process.env.SANITY_WEBHOOK_SECRET ?? ''))) {
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
  try {
    await sanityAlgolia.webhookSync(readClient, JSON.parse(body))
    return new Response('OK', { status: 200 })
  } catch (e) {
    console.error('Error sending data to algolia', e)
    return new Response('Something went wrong', { status: 500 })
  }
}
