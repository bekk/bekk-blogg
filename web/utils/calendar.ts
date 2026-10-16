// Julekalenderen følger norsk tid, uansett hvilken tidssone serveren (UTC på Vercel)
// eller nettleseren kjører i. All dato-logikk som avgjør hva som er åpent skal gå via
// funksjonene her, og "i dag" skal regnes ut per request – aldri ved modul-lasting.

const TIME_ZONE = 'Europe/Oslo'

/** Det første året bekk.christmas ble arrangert */
export const FIRST_CALENDAR_YEAR = 2017

/** Fra og med denne måneden (1-12) viser forsiden nedtelling til årets kalender */
export const TEASER_START_MONTH = 10

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Dagens dato i norsk tid, på formatet YYYY-MM-DD (samme format som `availableFrom` i Sanity) */
export function getOsloDate(now: Date = new Date()): string {
  return dateFormatter.format(now)
}

export function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

/** Datoen for en gitt luke, på formatet YYYY-MM-DD */
export function getDoorDate(year: number | string, day: number | string): string {
  return `${year}-12-${String(day).padStart(2, '0')}`
}

export function isDoorOpen(year: number | string, day: number | string, today: string): boolean {
  return getDoorDate(year, day) <= today
}

/** Om en dato tilsvarer en luke (1.–24. desember), og dermed har en side */
export function isDoorDate(isoDate: string): boolean {
  const { month, day } = parseIsoDate(isoDate)
  return month === 12 && day >= 1 && day <= 24
}

/** Om datoen er lille julaften (23. desember), siste dag før jul */
export function isLastDayBeforeChristmas(isoDate: string): boolean {
  const { month, day } = parseIsoDate(isoDate)
  return month === 12 && day === 23
}

/** Det siste året der kalenderen har startet (altså 1. desember har passert) */
export function getLatestCalendarYear(today: string): number {
  const { year, month } = parseIsoDate(today)
  return month === 12 ? year : year - 1
}

/** Om forsiden skal vise nedtelling til årets kalender i stedet for å sende videre */
export function isTeaserPeriod(today: string): boolean {
  const { month } = parseIsoDate(today)
  return month >= TEASER_START_MONTH && month < 12
}

/** Tidspunktet (som Date) når en gitt dato starter i norsk tid */
export function getOsloMidnight(isoDate: string): Date {
  const { year, month, day } = parseIsoDate(isoDate)
  const utcMidnight = Date.UTC(year, month - 1, day)
  // Finn differansen mellom UTC og norsk tid på dette tidspunktet (CET/CEST)
  const osloWallClock = new Date(new Date(utcMidnight).toLocaleString('en-US', { timeZone: TIME_ZONE }))
  const utcWallClock = new Date(new Date(utcMidnight).toLocaleString('en-US', { timeZone: 'UTC' }))
  const offset = osloWallClock.getTime() - utcWallClock.getTime()
  return new Date(utcMidnight - offset)
}

/** Når kalenderen for et gitt år starter (1. desember kl. 00:00 norsk tid) */
export function getCalendarStart(year: number): Date {
  return getOsloMidnight(getDoorDate(year, 1))
}

/** Antall sekunder til neste midnatt i norsk tid */
export function getSecondsUntilOsloMidnight(now: Date = new Date()): number {
  const { year, month, day } = parseIsoDate(getOsloDate(now))
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10)
  return Math.max(0, Math.ceil((getOsloMidnight(tomorrow).getTime() - now.getTime()) / 1000))
}

/** Stien til en post, f.eks. `/post/2024/03/min-artikkel` */
export function getPostPath(availableFrom: string, slug: string): string {
  const { year, day } = parseIsoDate(availableFrom)
  return `/post/${year}/${String(day).padStart(2, '0')}/${encodeURIComponent(slug)}`
}

/** Hvor mange kalendere gammel en post må være før vi varsler om at den kan være utdatert */
export const OLD_POST_AGE_IN_CALENDARS = 3

/**
 * Om en post er så gammel at innholdet kan være utdatert. Regnes i kalendere, ikke
 * kalenderår: før 1. desember er fjorårets kalender den nyeste.
 */
export function isOldPost(availableFrom: string, today: string): boolean {
  return getLatestCalendarYear(today) - parseIsoDate(availableFrom).year >= OLD_POST_AGE_IN_CALENDARS
}
