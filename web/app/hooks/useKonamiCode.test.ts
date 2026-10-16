import { describe, expect, it } from 'vitest'

import { KONAMIKODE, nesteKonamisteg } from './useKonamiCode'

const tast = (taster: string[]) => taster.reduce(nesteKonamisteg, 0)

describe('nesteKonamisteg', () => {
  it('fullfører koden', () => {
    expect(tast(KONAMIKODE)).toBe(KONAMIKODE.length)
  })

  it('bryr seg ikke om store og små bokstaver', () => {
    expect(tast([...KONAMIKODE.slice(0, 8), 'B', 'A'])).toBe(KONAMIKODE.length)
  })

  it('starter på nytt ved feil tast', () => {
    expect(tast(['ArrowUp', 'ArrowUp', 'x'])).toBe(0)
  })

  it('godtar en ekstra pil opp i starten', () => {
    expect(tast(['ArrowUp', ...KONAMIKODE])).toBe(KONAMIKODE.length)
  })

  it('kan starte på nytt midt i en feilet kode', () => {
    expect(tast(['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowUp', ...KONAMIKODE])).toBe(KONAMIKODE.length)
  })
})
