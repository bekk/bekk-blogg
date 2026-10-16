import { queryStore } from './loader'
import { studioUrl } from './config'
import { readClient } from './sanity.server'

type LoadQueryOptions = NonNullable<Parameters<typeof queryStore.loadQuery>[2]>

/**
 * Standardvalg for offentlige sider: kun publisert innhold, via CDN, uten stega.
 * Preview-valgene hentes fra `loadQueryOptions` og sendes eksplisitt inn.
 */
export const publishedQueryOptions: LoadQueryOptions = {
  perspective: 'published',
  useCdn: true,
  stega: false,
}

// Serverklienten settes én gang. Den skal aldri endres per request, siden den deles
// mellom alle requests på samme serverinstans. Stega er av som standard, men studioUrl
// må ligge her for at preview skal kunne slå det på per kall.
queryStore.setServerClient(
  readClient.withConfig({
    perspective: 'published',
    stega: { enabled: false, studioUrl },
  })
)

export function loadQuery<QueryResponseResult>(
  query: string,
  params: Parameters<typeof queryStore.loadQuery>[1] = {},
  options: LoadQueryOptions = publishedQueryOptions
) {
  return queryStore.loadQuery<QueryResponseResult>(query, params, options)
}
