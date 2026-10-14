import { getDoorDate, isDoorOpen } from './calendar'

const noStore = { 'Cache-Control': 'no-cache, no-store' }

/** Kaster 404 hvis luken ikke finnes, og 425 hvis den ikke har åpnet ennå */
export function assertDoorIsOpen(year: string, date: string, today: string) {
  const yearNumber = Number(year)
  const dateNumber = Number(date)

  if (isNaN(dateNumber) || isNaN(yearNumber) || dateNumber < 1 || dateNumber > 24) {
    throw new Response('Date not found', { status: 404, headers: noStore })
  }
  if (!isDoorOpen(year, date, today)) {
    throw new Response('Date not yet available', { status: 425, headers: noStore })
  }
}

/** Kaster 404 hvis posten ikke finnes, eller ikke hører til luken i URL-en */
export function assertPostBelongsToDoor<T extends { availableFrom?: string | null }>(
  post: T | null | undefined,
  year: string,
  date: string
): asserts post is T {
  if (!post) {
    throw new Response('Post not found', { status: 404, headers: noStore })
  }
  if (post.availableFrom !== getDoorDate(year, date)) {
    throw new Response('Post date and date in url do not match', { status: 404, headers: noStore })
  }
}
