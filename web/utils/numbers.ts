export const isNumericString = (str: string | null): str is string => {
  return str !== null && !Number.isNaN(Number(str))
}

/**
 * Leser `?page=` fra en URL. Mangler den, er det side 1. Er den ikke et positivt
 * heltall, kastes en 400 i stedet for å sende NaN eller negative tall til GROQ.
 */
export const getPageParam = (url: URL): number => {
  const raw = url.searchParams.get('page')
  if (raw === null) {
    return 1
  }
  const page = Number(raw)
  if (!Number.isInteger(page) || page < 1) {
    throw new Response('Invalid page', { status: 400, headers: { 'Cache-Control': 'no-cache, no-store' } })
  }
  return page
}
