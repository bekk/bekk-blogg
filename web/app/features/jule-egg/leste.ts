// Hvilke poster man har lest til bunnen, per dag, så man kan få kudos for å ha lest alt fra én dag.

const NOKKEL = 'jule-egg-leste'

type Leste = Record<string, string[]>

/**
 * Registrerer at en post er lest, og sier om det var den siste fra dagen.
 * Gir den nye lista, og om dagen akkurat ble fullført (ikke om den var fullført fra før).
 */
export const registrerLestPost = (leste: Leste, dag: string, id: string, dagensIder: string[]) => {
  const forDagen = leste[dag] ?? []
  const varFerdig = dagensIder.length > 0 && dagensIder.every((annen) => forDagen.includes(annen))
  const nye = forDagen.includes(id) ? forDagen : [...forDagen, id]
  const erFerdig = dagensIder.length > 0 && dagensIder.every((annen) => nye.includes(annen))
  return { leste: { ...leste, [dag]: nye }, fullfortDagen: erFerdig && !varFerdig }
}

/** Lagrer at en post er lest. Gir true hvis det var den siste uleste fra dagen. */
export const lestTilBunnen = (dag: string, id: string, dagensIder: string[]): boolean => {
  try {
    const lagret = JSON.parse(localStorage.getItem(NOKKEL) ?? '{}')
    const { leste, fullfortDagen } = registrerLestPost(
      lagret && typeof lagret === 'object' ? lagret : {},
      dag,
      id,
      dagensIder
    )
    localStorage.setItem(NOKKEL, JSON.stringify(leste))
    return fullfortDagen
  } catch {
    // Privat modus eller blokkert lagring: da kan vi ikke huske hva som er lest
    return false
  }
}
