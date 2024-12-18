import { useMatches } from '@remix-run/react'
import algoliasearch from 'algoliasearch'
import { useRef } from 'react'

export const useAlgoliaConfig = () => {
  const rootMatch = useMatches().find((match) => match.id === 'root')
  return (rootMatch?.data as { algolia: { app: string; key: string; index: string } })?.algolia
}

export const useAlgoliaClient = () => {
  const config = useAlgoliaConfig()
  const client = useRef(algoliasearch(config.app, config.key))
  return client
}
