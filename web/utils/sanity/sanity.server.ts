import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

export const writeClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_WRITE_API_TOKEN,
})

export const readClient = createClient({
  ...sanityConfig,
  useCdn: true,
  // Klienten har token, så uten dette kan den lese utkast
  perspective: 'published',
  token: process.env.SANITY_READ_API_TOKEN,
})
