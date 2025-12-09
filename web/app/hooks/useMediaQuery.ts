import { useSyncExternalStore } from 'react'

function useMediaQuery(query: string) {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function subscribe(callback: () => void) {
    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', callback)
    return () => mediaQueryList.removeEventListener('change', callback)
  }

  function getSnapshot() {
    return window.matchMedia(query).matches
  }

  function getServerSnapshot() {
    return false
  }
}

export default useMediaQuery
