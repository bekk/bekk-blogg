import algoliasearch from 'algoliasearch/lite'
import { useMemo } from 'react'
import { useRouteLoaderData } from 'react-router'

import type { loader as rootLoader } from '~/root'

export const useAlgoliaConfig = () => {
  return useRouteLoaderData<typeof rootLoader>('root')?.algolia
}

export const useAlgoliaClient = () => {
  const config = useAlgoliaConfig()
  return useMemo(() => (config ? algoliasearch(config.app, config.key) : null), [config])
}

/** Filter for poster som har åpnet. Søkenøkkelen håndhever det samme filteret. */
export const useAvailableFilter = () => {
  const config = useAlgoliaConfig()
  return `availableFromMillis <= ${config?.availableUntilMillis ?? 0}`
}
