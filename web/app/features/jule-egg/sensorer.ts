// Rene funksjoner for jule-eggene som avhenger av klokka eller bevegelse.
// Klokka er leserens egen, siden eggene handler om når leseren er våken, ikke om kalenderluker.

/** Midt på natta, mellom midnatt og fem */
export const erNatt = (tid: Date) => tid.getHours() < 5

/** Klokka er 13.37 */
export const erLeet = (tid: Date) => tid.getHours() === 13 && tid.getMinutes() === 37

/** Akselerasjon (uten tyngdekraft, i m/s²) som teller som et rist */
const RISTEGRENSE = 15
const RISTEVINDU_MS = 1000
const RIST_SOM_TRENGS = 4

/**
 * Holder styr på kraftige rykk, og gir beskjed når det har vært nok av dem tett nok til å være risting.
 * Gir de nye toppene, og om telefonen ristes.
 */
export const registrerBevegelse = (topper: number[], akselerasjon: number, tid: number) => {
  const nyeTopper = (akselerasjon > RISTEGRENSE ? [...topper, tid] : topper).filter((t) => tid - t <= RISTEVINDU_MS)
  const ristes = nyeTopper.length >= RIST_SOM_TRENGS
  return { topper: ristes ? [] : nyeTopper, ristes }
}

/** Hvor mange retningsskifter musa må gjøre innen ett sekund for å telle som risting */
const MUSESKIFT_SOM_TRENGS = 6
/** Bevegelser kortere enn dette er bare skjelving, og teller ikke som et skifte */
const MIN_MUSEBEVEGELSE = 25

export type Musetilstand = { startX: number; retning: number; skift: number[] }

export const NY_MUSETILSTAND: Musetilstand = { startX: 0, retning: 0, skift: [] }

/**
 * Risting på desktop: musa føres raskt fram og tilbake. Teller retningsskifter etter
 * bevegelser på minst `MIN_MUSEBEVEGELSE` piksler, og gir beskjed når det har vært mange nok.
 */
export const registrerMusebevegelse = (tilstand: Musetilstand, x: number, tid: number) => {
  const dx = x - tilstand.startX
  if (Math.abs(dx) < MIN_MUSEBEVEGELSE) {
    return { tilstand, ristes: false }
  }
  const retning = Math.sign(dx)
  const skift = (
    retning !== tilstand.retning && tilstand.retning !== 0 ? [...tilstand.skift, tid] : tilstand.skift
  ).filter((t) => tid - t <= RISTEVINDU_MS)
  const ristes = skift.length >= MUSESKIFT_SOM_TRENGS
  return { tilstand: { startX: x, retning, skift: ristes ? [] : skift }, ristes }
}

/** Hvor langt og raskt en finger må bevege seg for å telle som et sveip */
const MIN_SVEIP = 40
const MAKS_SVEIPETID_MS = 700
const MAKS_TRYKK = 10
const MAKS_TRYKKETID_MS = 300

/**
 * Gjør om en berøring til en «tast», så konamikoden kan tastes med sveip og trykk på mobil.
 * Gir `arrowup` osv. for sveip i den retningen fingeren beveget seg, `trykk` for et kort trykk, ellers null.
 */
export const tolkBeroring = (dx: number, dy: number, ms: number): string | null => {
  const avstand = Math.hypot(dx, dy)
  if (avstand <= MAKS_TRYKK && ms <= MAKS_TRYKKETID_MS) {
    return 'trykk'
  }
  if (avstand < MIN_SVEIP || ms > MAKS_SVEIPETID_MS) {
    return null
  }
  // Skrå sveip er for usikre til å telle
  if (Math.abs(dx) > Math.abs(dy) * 1.5) {
    return dx > 0 ? 'arrowright' : 'arrowleft'
  }
  if (Math.abs(dy) > Math.abs(dx) * 1.5) {
    return dy > 0 ? 'arrowdown' : 'arrowup'
  }
  return null
}
