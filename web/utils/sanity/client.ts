import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

export const client = createClient({
  ...sanityConfig,
  useCdn: true,
  perspective: 'published',
})
