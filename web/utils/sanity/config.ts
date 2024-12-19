declare global {
  interface Window {
    ENV: {
      SANITY_STUDIO_PROJECT_ID: string
      SANITY_STUDIO_DATASET: string
      SANITY_STUDIO_URL: string
    }
  }
}

const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_URL = 'http://localhost:3333',
} = typeof document === 'undefined' ? process.env : window.ENV

export const projectId = SANITY_STUDIO_PROJECT_ID!
export const dataset = SANITY_STUDIO_DATASET!
export const studioUrl = SANITY_STUDIO_URL!

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID in .env')
}
if (!dataset) {
  throw new Error('Missing SANITY_STUDIO_DATASET in .env')
}
if (!studioUrl) {
  throw new Error('Missing SANITY_STUDIO_URL in .env')
}

export const sanityConfig = {
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-12-09',
}
