import algoliasearch from 'algoliasearch'
import { getOsloMidnight } from 'utils/calendar'

const KEY_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Lager en søkenøkkel som bare gir tilgang til poster som har åpnet.
 *
 * Filteret ligger inne i selve nøkkelen, så det kan ikke fjernes fra klienten.
 * Grensen er starten av dagens dato i norsk tid, og siden root-loaderen caches
 * til midnatt, gjelder samme nøkkel ut dagen.
 */
export function getSecuredSearchKey(today: string) {
  const parentKey = process.env.ALGOLIA_SEARCH_KEY
  if (!parentKey || !process.env.ALGOLIA_APP_ID) {
    // Uten konfigurasjon (f.eks. i CI) skjules søket i stedet for at alle sider feiler
    return null
  }
  // `availableFromMillis` er `availableFrom` (en dato) tolket som UTC-midnatt
  const availableUntilMillis = Date.parse(`${today}T00:00:00Z`)
  const key = algoliasearch(process.env.ALGOLIA_APP_ID, parentKey).generateSecuredApiKey(parentKey, {
    filters: `availableFromMillis <= ${availableUntilMillis}`,
    validUntil: Math.floor((getOsloMidnight(today).getTime() + KEY_LIFETIME_MS) / 1000),
  })
  return { key, availableUntilMillis }
}
