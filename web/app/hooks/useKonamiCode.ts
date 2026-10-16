import { useEffect, useRef } from 'react'

export const KONAMIKODE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
]

/**
 * Regner ut hvor langt man har kommet i konamikoden etter et nytt tastetrykk.
 * Ved feil tast beholdes den lengste delen av det som er tastet som fortsatt kan bli koden,
 * så ↑↑↑↓↓… gir treff.
 */
export const nesteKonamisteg = (steg: number, tast: string): number => {
  const tastet = [...KONAMIKODE.slice(0, steg), tast.toLowerCase()]
  for (let lengde = Math.min(tastet.length, KONAMIKODE.length); lengde > 0; lengde--) {
    const slutt = tastet.slice(-lengde)
    if (slutt.every((t, i) => t === KONAMIKODE[i])) {
      return lengde
    }
  }
  return 0
}

const skriverITekstfelt = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** Kaller `onKode` når noen taster konamikoden (↑↑↓↓←→←→BA) */
export const useKonamiCode = (onKode: () => void) => {
  const onKodeRef = useRef(onKode)
  useEffect(() => {
    onKodeRef.current = onKode
  })

  useEffect(() => {
    let steg = 0
    const onKeyDown = (event: KeyboardEvent) => {
      if (skriverITekstfelt(event.target)) {
        return
      }
      steg = nesteKonamisteg(steg, event.key)
      if (steg === KONAMIKODE.length) {
        steg = 0
        onKodeRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
