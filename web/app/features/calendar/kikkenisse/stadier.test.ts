import { describe, expect, it } from 'vitest'

import { replikkFor, stadiumFor } from './stadier'

describe('stadiumFor', () => {
  it('lar de to første klikkene bare riste luka', () => {
    expect(stadiumFor(1)).toBeNull()
    expect(stadiumFor(2)).toBeNull()
  })

  it('blir mer og mer sassy', () => {
    expect(stadiumFor(3)).toBe('kikk')
    expect(stadiumFor(10)).toBe('nei')
    expect(stadiumFor(20)).toBe('liste')
    expect(stadiumFor(35)).toBe('sur')
    expect(stadiumFor(49)).toBe('sur')
  })

  it('viser rumpa ved klikk nummer 50', () => {
    expect(stadiumFor(50)).toBe('rumpe')
  })
})

describe('replikkFor', () => {
  it('sier ingenting når han bare kikker', () => {
    expect(replikkFor(5, 14)).toBeNull()
  })

  it('nevner hvilken dag luka åpner', () => {
    const replikker = Array.from({ length: 10 }, (_, i) => replikkFor(10 + i, 14))
    expect(replikker).toContain('Ikke før den 14.!')
  })
})
