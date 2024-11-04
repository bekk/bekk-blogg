import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

export const writeClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_WRITE_API_TOKEN,
})

export const authClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_SESSION_API_TOKEN,
})
