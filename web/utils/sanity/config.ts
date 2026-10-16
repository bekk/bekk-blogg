declare global {
  interface Window {
    ENV: {
      SANITY_STUDIO_PROJECT_ID: string
      SANITY_STUDIO_DATASET: string
    }
  }
}

const { SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET } = typeof document === 'undefined' ? process.env : window.ENV

export const projectId = SANITY_STUDIO_PROJECT_ID!
export const dataset = SANITY_STUDIO_DATASET!
// Studioet ligger i web-appen, så stega-lenkene kan peke relativt dit
export const studioUrl = '/studio'

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID in .env')
}
if (!dataset) {
  throw new Error('Missing SANITY_STUDIO_DATASET in .env')
}

export const sanityConfig = {
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-12-09',
}
