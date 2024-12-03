import * as queryStore from '@sanity/react-loader'

import { writeClient } from './sanity.server'

const token = process.env.SANITY_READ_API_TOKEN

if (!token) {
  throw new Error('Missing SANITY_READ_API_TOKEN in .env')
}

const clientWithToken = writeClient.withConfig({
  token,
  perspective: 'published', //'previewDrafts',
  //stega: {
  //  enabled: true,
  //  studioUrl: process.env.SANITY_STUDIO_URL,
  //},
})

queryStore.setServerClient(clientWithToken)

export const { loadQuery } = queryStore
