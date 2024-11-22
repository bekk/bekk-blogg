export {}
declare global {
  interface Window {
    plausible: (eventName: string, options?: { callback?: () => void; props?: Record<string, unknown> }) => void
    ENV?: {
      SANITY_STUDIO_PROJECT_ID: string
      SANITY_STUDIO_DATASET: string
      SANITY_API_VERSION: string
      NODE_ENV: string
    }
  }
}
