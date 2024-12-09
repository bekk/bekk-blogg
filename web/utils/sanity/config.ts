export const sanityConfig = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'ah2n1vfr',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'bekk-blogg',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: process.env.SANITY_API_VERSION ?? '2024-12-09',
}
