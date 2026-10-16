import { describe, expect, it } from 'vitest'

import { ALLE_EGG, antallFunnet, VANLIGE_EGG } from './egg'
import { leggTil } from './lager'
import { registrerLestPost } from './leste'
import { erLeet, erNatt, registrerBevegelse } from './sensorer'

describe('eggene', () => {
  it('er 24 vanlige egg, ett for hver luke', () => {
    expect(VANLIGE_EGG).toHaveLength(24)
  })

  it('har unike id-er', () => {
    expect(new Set(ALLE_EGG.map((egg) => egg.id)).size).toBe(ALLE_EGG.length)
  })

  it('teller ikke bonusegg', () => {
    expect(antallFunnet(['sno', 'snokanon', 'ukjent'])).toBe(1)
  })
})

describe('leggTil', () => {
  it('legger til nye egg', () => {
    expect(leggTil(['sno'], 'rudolf')).toEqual(['sno', 'rudolf'])
  })

  it('gir null for egg som allerede er funnet', () => {
    expect(leggTil(['sno'], 'sno')).toBeNull()
  })
})

describe('erNatt og erLeet', () => {
  it('er natt mellom midnatt og fem', () => {
    expect(erNatt(new Date(2025, 11, 5, 0, 10))).toBe(true)
    expect(erNatt(new Date(2025, 11, 5, 4, 59))).toBe(true)
    expect(erNatt(new Date(2025, 11, 5, 5, 0))).toBe(false)
    expect(erNatt(new Date(2025, 11, 5, 23, 59))).toBe(false)
  })

  it('er leet bare klokka 13.37', () => {
    expect(erLeet(new Date(2025, 11, 5, 13, 37, 59))).toBe(true)
    expect(erLeet(new Date(2025, 11, 5, 13, 38))).toBe(false)
    expect(erLeet(new Date(2025, 11, 5, 1, 37))).toBe(false)
  })
})

describe('registrerBevegelse', () => {
  const rist = (rykk: [number, number][]) =>
    rykk.reduce(
      (tilstand, [akselerasjon, tid]) => {
        const neste = registrerBevegelse(tilstand.topper, akselerasjon, tid)
        return { topper: neste.topper, ristes: tilstand.ristes || neste.ristes }
      },
      { topper: [] as number[], ristes: false }
    ).ristes

  it('kjenner igjen risting', () => {
    expect(
      rist([
        [20, 0],
        [20, 200],
        [20, 400],
        [20, 600],
      ])
    ).toBe(true)
  })

  it('bryr seg ikke om rolig bevegelse', () => {
    expect(
      rist([
        [5, 0],
        [8, 200],
        [3, 400],
        [9, 600],
      ])
    ).toBe(false)
  })

  it('bryr seg ikke om enkeltrykk med god avstand, som når man går', () => {
    expect(
      rist([
        [20, 0],
        [20, 700],
        [20, 1400],
        [20, 2100],
      ])
    ).toBe(false)
  })
})

describe('registrerLestPost', () => {
  const dag = '2025-12-05'
  const dagensIder = ['a', 'b', 'c']

  it('fullfører dagen når den siste posten er lest', () => {
    const forst = registrerLestPost({}, dag, 'a', dagensIder)
    const andre = registrerLestPost(forst.leste, dag, 'b', dagensIder)
    const siste = registrerLestPost(andre.leste, dag, 'c', dagensIder)
    expect([forst.fullfortDagen, andre.fullfortDagen, siste.fullfortDagen]).toEqual([false, false, true])
  })

  it('gir bare kudos én gang per dag', () => {
    const ferdig = registrerLestPost({ [dag]: ['a', 'b', 'c'] }, dag, 'a', dagensIder)
    expect(ferdig.fullfortDagen).toBe(false)
  })

  it('teller ikke samme post to ganger', () => {
    const igjen = registrerLestPost({ [dag]: ['a'] }, dag, 'a', dagensIder)
    expect(igjen.leste[dag]).toEqual(['a'])
  })
})
