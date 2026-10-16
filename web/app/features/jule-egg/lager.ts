// Hvilke jule-egg man har funnet, lagret i nettleseren.
// Modulen har ingen avhengigheter, så Studioet (som Sanity CLI også laster) kan importere den med relativ sti.

const NOKKEL = 'jule-egg-funnet'

/** Hendelsen som sendes på `window` når et nytt egg er funnet, med id-en i `detail` */
export const FUNNET_HENDELSE = 'jule-egg-funnet'

/** Legger til et egg i lista, eller gir null hvis det allerede er funnet */
export const leggTil = (funnet: string[], id: string): string[] | null => (funnet.includes(id) ? null : [...funnet, id])

export const lesFunnet = (): string[] => {
  try {
    const verdi = JSON.parse(localStorage.getItem(NOKKEL) ?? '[]')
    return Array.isArray(verdi) ? verdi.filter((id) => typeof id === 'string') : []
  } catch {
    // Privat modus eller blokkert lagring
    return []
  }
}

/** Registrerer at et egg er funnet. Gir true bare første gang, og sier bare fra da. */
export const finnEgg = (id: string): boolean => {
  const neste = leggTil(lesFunnet(), id)
  if (!neste) {
    return false
  }
  try {
    localStorage.setItem(NOKKEL, JSON.stringify(neste))
  } catch {
    // Kan ikke huske det, men vi feirer likevel
  }
  window.dispatchEvent(new CustomEvent(FUNNET_HENDELSE, { detail: id }))
  return true
}
