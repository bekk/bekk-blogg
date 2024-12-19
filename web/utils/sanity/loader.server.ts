import { ClientConfig } from '@sanity/client'
import { queryStore } from './loader'
import { readClient } from './sanity.server'

queryStore.setServerClient(
  readClient.withConfig({ stega: { enabled: true, studioUrl: process.env.SANITY_STUDIO_URL } })
)

export const setServerClient = (config: Partial<ClientConfig>) => {
  queryStore.setServerClient(readClient.withConfig(config))
}

export const { loadQuery } = queryStore
