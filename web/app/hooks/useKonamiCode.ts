import { useTastesekvens } from './useTastesekvens'

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

/** Kaller `onKode` når noen taster konamikoden (↑↑↓↓←→←→BA) */
export const useKonamiCode = (onKode: () => void) => useTastesekvens(KONAMIKODE, onKode)
