import { useEffect, useRef } from 'react'

/**
 * Regner ut hvor langt man har kommet i en tastesekvens etter et nytt tastetrykk.
 * Ved feil tast beholdes den lengste delen av det som er tastet som fortsatt kan bli sekvensen,
 * så for eksempel ↑↑↑↓↓… gir treff på konamikoden.
 */
export const nesteSteg = (sekvens: string[], steg: number, tast: string): number => {
  const tastet = [...sekvens.slice(0, steg), tast.toLowerCase()]
  for (let lengde = Math.min(tastet.length, sekvens.length); lengde > 0; lengde--) {
    const slutt = tastet.slice(-lengde)
    if (slutt.every((t, i) => t === sekvens[i])) {
      return lengde
    }
  }
  return 0
}

/** Taster som trykkes for å lage andre tegn (som Shift+B eller Alt+O for ø), og ikke skal telle med */
const MODIFIKATORER = ['shift', 'alt', 'altgraph', 'control', 'meta', 'capslock', 'dead', 'compose']

export const erModifikator = (tast: string) => MODIFIKATORER.includes(tast.toLowerCase())

const skriverITekstfelt = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** Kaller `onTreff` når noen taster `sekvens` (med små bokstaver, og tastenavn som `arrowup`) */
export const useTastesekvens = (sekvens: string[], onTreff: () => void) => {
  const onTreffRef = useRef(onTreff)
  useEffect(() => {
    onTreffRef.current = onTreff
  })

  const sekvensnokkel = sekvens.join(' ')
  useEffect(() => {
    const taster = sekvensnokkel.split(' ')
    let steg = 0
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || erModifikator(event.key) || skriverITekstfelt(event.target)) {
        return
      }
      steg = nesteSteg(taster, steg, event.key)
      if (steg === taster.length) {
        steg = 0
        onTreffRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sekvensnokkel])
}
