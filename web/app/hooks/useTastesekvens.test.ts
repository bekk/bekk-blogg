import { describe, expect, it } from 'vitest'

import { KONAMIKODE } from './useKonamiCode'
import { erModifikator, nesteSteg } from './useTastesekvens'

// Samme filtrering som hooken gjør før den kaller nesteSteg
const tast = (taster: string[], sekvens = KONAMIKODE) =>
  taster.filter((t) => !erModifikator(t)).reduce((steg, t) => nesteSteg(sekvens, steg, t), 0)

describe('nesteSteg', () => {
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

  it('lar modifikatortaster midt i sekvensen være', () => {
    expect(tast([...KONAMIKODE.slice(0, 8), 'Shift', 'B', 'Shift', 'A'])).toBe(KONAMIKODE.length)
    expect(tast(['s', 'n', 'Alt', 'ø'], ['s', 'n', 'ø'])).toBe(3)
  })

  it('virker for andre sekvenser', () => {
    expect(tast(['ø', 'n', 's'], ['ø', 'n', 's'])).toBe(3)
    expect(tast(['s', 'n', 'ø'], ['ø', 'n', 's'])).toBe(1)
  })
})
