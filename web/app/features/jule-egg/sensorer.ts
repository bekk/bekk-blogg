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
