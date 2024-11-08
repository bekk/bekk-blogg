import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

export const readClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_WRITE_API_TOKEN,
})
