export const sanityConfig = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.NODE_ENV === 'production' ? process.env.SANITY_STUDIO_DATASET : 'bekk-blogg',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: process.env.SANITY_API_VERSION,
}
