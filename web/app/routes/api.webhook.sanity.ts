// serverless function for handling webhooks

import { ActionFunction } from '@remix-run/node'
import algoliasearch from 'algoliasearch'
import indexer from 'sanity-algolia'

import { POST_SEARCH_PROJECTION } from '../../utils/sanity/queries/postQueries'
import { readClient } from '../../utils/sanity/sanity.server'
import { Post } from '../../utils/sanity/types/sanity.types'

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export const action: ActionFunction = async (req) => {
  const body = await req.request.json()

  const algolia = algoliasearch(process.env.ALGOLIA_APP_ID ?? '', process.env.ALGOLIA_ADMIN_API_KEY ?? '')
  const algoliaIndex = algolia.initIndex(process.env.ALGOLIA_INDEX ?? '')

  const sanityAlgolia = indexer(
    {
      post: {
        index: algoliaIndex,
        projection: POST_SEARCH_PROJECTION,
      },
    },
    (post) => post,
    (post) => {
      const availableFrom = new Date((post as Post).availableFrom)
      return availableFrom <= new Date()
    }
  )

  return sanityAlgolia
    .webhookSync(readClient, body)
    .then(() => new Response('OK', { status: 200 }))
    .catch((err) => {
      console.error('Error sending data to algolia', err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong' }),
      }
    })
}
