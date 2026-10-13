import { createClient } from '@sanity/client'
import { dataset, projectId, sanityConfig, studioUrl } from './config'

// Do not import this into client-side components unless lazy-loaded
export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: sanityConfig.apiVersion,
  stega: {
    enabled: true,
    studioUrl,
  },
})
