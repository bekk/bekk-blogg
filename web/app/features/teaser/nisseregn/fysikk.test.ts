import { describe, expect, it } from 'vitest'

import { harNaddBunnen, steg, type Flate, type Nisse } from './fysikk'

const nisse = (endringer: Partial<Nisse> = {}): Nisse => ({
  id: 1,
  x: 100,
  y: 0,
  vx: 50,
  vy: 0,
  flate: null,
  ...endringer,
})
const omgivelser = (flater: Flate[] = []) => ({ flater, bredde: 1000, fallfart: 400 })

describe('steg', () => {
  it('faller når den ikke står på noe', () => {
    const etter = steg(nisse(), 0.1, omgivelser())
    expect(etter.y).toBeGreaterThan(0)
    expect(etter.flate).toBeNull()
  })

  it('faller ikke fortere enn fallfarten', () => {
    const etter = steg(nisse({ vy: 10_000 }), 0.1, omgivelser())
    expect(etter.vy).toBe(400)
  })

  it('lander på en flate den passerer', () => {
    const flater = [{ venstre: 0, hoyre: 200, topp: 30 }]
    const etter = steg(nisse({ y: 25, vy: 300 }), 0.1, omgivelser(flater))
    expect(etter).toMatchObject({ y: 30, vy: 0, flate: 0 })
  })

  it('lander på den øverste av flere flater', () => {
    const flater = [
      { venstre: 0, hoyre: 200, topp: 50 },
      { venstre: 0, hoyre: 200, topp: 30 },
    ]
    const etter = steg(nisse({ y: 25, vy: 400 }), 0.1, omgivelser(flater))
    expect(etter.flate).toBe(1)
  })

  it('faller forbi flater den ikke er over', () => {
    const flater = [{ venstre: 300, hoyre: 400, topp: 30 }]
    const etter = steg(nisse({ y: 25, vy: 300 }), 0.1, omgivelser(flater))
    expect(etter.flate).toBeNull()
  })

  it('løper langs flaten og følger den hvis den flytter seg', () => {
    const flater = [{ venstre: 0, hoyre: 200, topp: 80 }]
    const etter = steg(nisse({ y: 30, flate: 0 }), 0.1, omgivelser(flater))
    expect(etter).toMatchObject({ x: 105, y: 80, flate: 0 })
  })

  it('hopper utfor kanten', () => {
    const flater = [{ venstre: 0, hoyre: 102, topp: 30 }]
    const etter = steg(nisse({ y: 30, flate: 0 }), 0.1, omgivelser(flater))
    expect(etter.flate).toBeNull()
    expect(etter.vy).toBeLessThan(0)
  })

  it('faller hvis flaten forsvinner', () => {
    const flater = [{ venstre: 0, hoyre: 0, topp: 0 }]
    const etter = steg(nisse({ y: 30, flate: 0 }), 0.1, omgivelser(flater))
    expect(etter.flate).toBeNull()
  })

  it('snur ved kanten av skjermen', () => {
    const flater = [{ venstre: 0, hoyre: 1000, topp: 30 }]
    const etter = steg(nisse({ x: 998, y: 30, flate: 0 }), 0.1, omgivelser(flater))
    expect(etter.vx).toBe(-50)
    expect(etter.x).toBe(1000)
  })
})

describe('harNaddBunnen', () => {
  it('er sann først når nissen er forbi bunnen', () => {
    expect(harNaddBunnen(nisse({ y: 800 }), 800)).toBe(false)
    expect(harNaddBunnen(nisse({ y: 801 }), 800)).toBe(true)
  })
})
