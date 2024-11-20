import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

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

export const readClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_READ_API_TOKEN,
})

const builder = imageUrlBuilder(readClient)
export const urlFor = (source: SanityImageSource) => builder.image(source).format('webp').quality(80)
