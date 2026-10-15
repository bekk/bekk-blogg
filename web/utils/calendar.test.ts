import { describe, expect, it } from 'vitest'

import {
  getCalendarStart,
  getLatestCalendarYear,
  getOsloDate,
  getSecondsUntilOsloMidnight,
  isDoorDate,
  isDoorOpen,
  isOldPost,
  isTeaserPeriod,
} from './calendar'

// Testene kjøres med TZ=UTC (se vitest.config.ts), slik som på Vercel.

describe('getOsloDate', () => {
  it('bytter dato ved midnatt norsk tid, ikke UTC', () => {
    expect(getOsloDate(new Date('2026-11-30T22:59:00Z'))).toBe('2026-11-30')
    expect(getOsloDate(new Date('2026-11-30T23:00:00Z'))).toBe('2026-12-01')
  })

  it('håndterer sommertid', () => {
    expect(getOsloDate(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-02')
  })
})

describe('isDoorOpen', () => {
  it('åpner luke 1 kl. 00:30 norsk tid 1. desember', () => {
    const today = getOsloDate(new Date('2026-11-30T23:30:00Z'))
    expect(isDoorOpen(2026, 1, today)).toBe(true)
    expect(isDoorOpen(2026, 2, today)).toBe(false)
  })

  it('holder luke 1 lukket kl. 23:59 30. november', () => {
    expect(isDoorOpen(2026, 1, getOsloDate(new Date('2026-11-30T22:59:00Z')))).toBe(false)
  })

  it('har alle luker åpne for tidligere år', () => {
    expect(isDoorOpen(2025, 24, '2026-10-12')).toBe(true)
  })
})

describe('getLatestCalendarYear og isTeaserPeriod', () => {
  it.each([
    // [beskrivelse, tidspunkt, siste kalenderår, teaser]
    ['januar', '2027-01-15T12:00:00Z', 2026, false],
    ['september', '2026-09-15T12:00:00Z', 2025, false],
    ['oktober', '2026-10-12T12:00:00Z', 2025, true],
    ['november', '2026-11-30T22:59:00Z', 2025, true],
    ['1. desember kl. 00:30', '2026-11-30T23:30:00Z', 2026, false],
    ['26. desember', '2026-12-26T12:00:00Z', 2026, false],
    ['nyttårsaften kl. 23:30', '2026-12-31T22:30:00Z', 2026, false],
  ])('%s', (_, instant, latestYear, teaser) => {
    const today = getOsloDate(new Date(instant))
    expect(getLatestCalendarYear(today)).toBe(latestYear)
    expect(isTeaserPeriod(today)).toBe(teaser)
  })
})

describe('getCalendarStart', () => {
  it('er 1. desember kl. 00:00 norsk tid', () => {
    expect(getCalendarStart(2026).toISOString()).toBe('2026-11-30T23:00:00.000Z')
  })
})

describe('getSecondsUntilOsloMidnight', () => {
  it('teller ned til midnatt norsk tid', () => {
    expect(getSecondsUntilOsloMidnight(new Date('2026-11-30T22:00:00Z'))).toBe(3600)
    expect(getSecondsUntilOsloMidnight(new Date('2026-11-30T23:00:00Z'))).toBe(24 * 3600)
  })

  it('håndterer overgang til vintertid', () => {
    // 25. oktober 2026 er 25 timer lang i Norge
    expect(getSecondsUntilOsloMidnight(new Date('2026-10-24T22:00:00Z'))).toBe(25 * 3600)
  })
})

describe('isDoorDate', () => {
  it('gjelder bare 1.–24. desember', () => {
    expect(isDoorDate('2025-12-01')).toBe(true)
    expect(isDoorDate('2025-12-24')).toBe(true)
    expect(isDoorDate('2025-12-25')).toBe(false)
    expect(isDoorDate('2025-11-30')).toBe(false)
  })
})

describe('isOldPost', () => {
  it('varsler for poster fra tre kalendere siden eller eldre', () => {
    expect(isOldPost('2022-12-10', '2025-12-01')).toBe(true)
    expect(isOldPost('2019-12-10', '2025-12-01')).toBe(true)
    expect(isOldPost('2023-12-10', '2025-12-01')).toBe(false)
    expect(isOldPost('2025-12-01', '2025-12-01')).toBe(false)
  })

  it('regner årets kalender med først fra 1. desember', () => {
    expect(isOldPost('2022-12-10', '2025-11-30')).toBe(false)
    expect(isOldPost('2022-12-10', '2025-12-01')).toBe(true)
  })
})
