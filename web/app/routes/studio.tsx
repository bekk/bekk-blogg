import { lazy, Suspense } from 'react'
import type { HeadersFunction, MetaFunction } from 'react-router'
import { generateSecurityHeaders } from 'utils/security'

// Studioet lastes bare i nettleseren, så det ikke havner i serverbundelen
const Studio = lazy(() => import('../../studio/Studio'))

export const meta: MetaFunction = () => [{ title: 'Bekk Christmas Studio' }, { name: 'robots', content: 'noindex' }]

export const headers: HeadersFunction = ({ parentHeaders }) => {
  // `set` erstatter CSP-en fra root i stedet for å legge til en ekstra, som også ville blitt håndhevet
  const headers = new Headers(parentHeaders)
  for (const [key, value] of Object.entries(generateSecurityHeaders({ studio: true }))) {
    headers.set(key, value)
  }
  return headers
}

// En clientLoader med `hydrate` gjør at serveren bare rendrer HydrateFallback,
// og at Studioet først rendres i nettleseren
export const clientLoader = async () => null
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return null
}

export default function StudioRoute() {
  return (
    <Suspense fallback={null}>
      <Studio />
    </Suspense>
  )
}
