export {}
declare global {
  interface Window {
    plausible: (eventName: string, options?: { callback?: () => void; props?: Record<string, unknown> }) => void
  }
}
