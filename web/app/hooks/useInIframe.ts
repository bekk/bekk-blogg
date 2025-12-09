import { useSyncExternalStore } from 'react'

export const useInIframe = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function subscribe() {
    return () => {}
  }

  function getSnapshot() {
    return window.self !== window.top
  }

  function getServerSnapshot() {
    return true
  }
}
