import { useEffect, useRef } from 'react'
import { tolkBeroring } from '~/features/jule-egg/sensorer'

import { nesteSteg, useTastesekvens } from './useTastesekvens'

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

/** Mobilvarianten: sveip i samme retninger som pilene, og to trykk i stedet for B og A */
export const KONAMIKODE_SVEIP = [...KONAMIKODE.slice(0, 8), 'trykk', 'trykk']

/** Kaller `onKode` når noen sveiper konamikoden på en berøringsskjerm */
const useKonamiSveip = (onKode: () => void) => {
  const onKodeRef = useRef(onKode)
  useEffect(() => {
    onKodeRef.current = onKode
  })

  useEffect(() => {
    let steg = 0
    let start: { x: number; y: number; tid: number } | null = null
    const onStart = (event: TouchEvent) => {
      const beroring = event.touches[0]
      start = event.touches.length === 1 ? { x: beroring.clientX, y: beroring.clientY, tid: event.timeStamp } : null
    }
    const onSlutt = (event: TouchEvent) => {
      const beroring = event.changedTouches[0]
      if (!start || !beroring) {
        return
      }
      const tast = tolkBeroring(beroring.clientX - start.x, beroring.clientY - start.y, event.timeStamp - start.tid)
      start = null
      if (!tast) {
        return
      }
      steg = nesteSteg(KONAMIKODE_SVEIP, steg, tast)
      if (steg === KONAMIKODE_SVEIP.length) {
        steg = 0
        onKodeRef.current()
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onSlutt, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onSlutt)
    }
  }, [])
}

/** Kaller `onKode` når noen taster konamikoden (↑↑↓↓←→←→BA), eller sveiper den på mobil */
export const useKonamiCode = (onKode: () => void) => {
  useTastesekvens(KONAMIKODE, onKode)
  useKonamiSveip(onKode)
}
