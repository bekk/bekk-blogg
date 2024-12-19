import { createClient } from '@sanity/client'
import { dataset, projectId, studioUrl } from './config'

// Do not import this into client-side components unless lazy-loaded
export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-12-19',
  stega: {
    enabled: true,
    studioUrl,
  },
})
