type CustomEvent = 'article_audio_played'

export const trackEvent = (eventName: CustomEvent, options?: Record<string, string | number>) => {
  // Check if DNT is enabled (returns true if user has requested not to be tracked)
  const doNotTrack = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'

  // Don't track anything if we're not in browser, analytics isn't loaded, or DNT is enabled
  if (typeof window === 'undefined' || !('plausible' in window) || doNotTrack) {
    return
  }

  window.plausible(eventName, { props: options })
}
