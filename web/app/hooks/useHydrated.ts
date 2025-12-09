import { useSyncExternalStore } from 'react'

export const useHydrated = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function subscribe() {
    return () => {}
  }

  function getSnapshot() {
    return true
  }

  function getServerSnapshot() {
    return false
  }
}
