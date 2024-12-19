type CustomEvent =
  | 'article_audio_played'
  | 'like_content_clicked'
  | 'copy_url_clicked'
  | 'related_post_clicked'
  | 'newsletter_modal_opened'
  | 'signed_up_newsletter'
  | 'newsletter_modal_closed'

export const trackEvent = (eventName: CustomEvent, options?: Record<string, string | number>) => {
  // Check if DNT is enabled (returns true if user has requested not to be tracked)
  const doNotTrack = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'

  // Don't track anything if we're not in browser, analytics isn't loaded, or DNT is enabled
  if (typeof window === 'undefined' || !('plausible' in window) || doNotTrack) {
    return
  }

  window.plausible(eventName, { props: options })
}
