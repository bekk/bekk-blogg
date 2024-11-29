import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

export const writeClient = createClient({
  ...sanityConfig,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_WRITE_API_TOKEN,
})

export const authClient = createClient({
  ...sanityConfig,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_SESSION_API_TOKEN,
})

export const readClient = createClient({
  ...sanityConfig,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_READ_API_TOKEN,
})
