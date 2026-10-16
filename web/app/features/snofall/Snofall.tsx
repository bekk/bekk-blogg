import { useEffect, useState } from 'react'
import { SNOFNUGG } from '~/features/calendar/SnowAnimation'
import { finnEgg } from '~/features/jule-egg/lager'
import { NY_MUSETILSTAND, registrerBevegelse, registrerMusebevegelse } from '~/features/jule-egg/sensorer'
import { useTastesekvens } from '~/hooks/useTastesekvens'

import './snofall.css'

const ANTALL_FNUGG = 80
/** Lengste forsinkelse pluss lengste varighet, så alle fnuggene rekker å komme fram */
const VARIGHET_MS = 14_000

type Retning = 'ned' | 'opp'

const SNOFALL_HENDELSE = 'snofall'

/** Starter en snøbyge fra hvor som helst, for eksempel fra konsollen */
export const startSnofall = (retning: Retning = 'ned') =>
  window.dispatchEvent(new CustomEvent<Retning>(SNOFALL_HENDELSE, { detail: retning }))

type Fnugg = { id: number; storrelse: number; venstre: number; varighet: number; forsinkelse: number }

const lagFnugg = (): Fnugg[] =>
  Array.from({ length: ANTALL_FNUGG }, (_, id) => ({
    id,
    storrelse: 10 + Math.random() * 30,
    venstre: Math.random() * 100,
    varighet: 4 + Math.random() * 5,
    forsinkelse: Math.random() * 5,
  }))

/** En snøbyge over hele siden. Opp betyr at snøen faller oppover. */
const Snobyge = ({ retning }: { retning: Retning }) => {
  const [fnugg] = useState(lagFnugg)
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[90] overflow-hidden pointer-events-none motion-reduce:hidden">
      {fnugg.map(({ id, storrelse, venstre, varighet, forsinkelse }) => (
        <svg
          key={id}
          className="absolute"
          viewBox="0 0 100 100"
          style={{
            left: `${venstre}%`,
            top: 0,
            width: storrelse,
            height: storrelse,
            animation: `snofall ${varighet}s linear ${forsinkelse}s both`,
            animationDirection: retning === 'ned' ? 'normal' : 'reverse',
          }}
        >
          <path fill="#fff" d={SNOFNUGG} />
        </svg>
      ))}
    </div>
  )
}

/**
 * Easter egg: skriver man «snø» et sted på siden, snør det. Skriver man «øns», snør det oppover.
 * Det snør også når man rister telefonen, og når noen kaller `startSnofall`.
 */
export const Snofall = () => {
  const [byge, setByge] = useState<{ id: number; retning: Retning } | null>(null)

  useTastesekvens(['s', 'n', 'ø'], () => {
    setByge({ id: Date.now(), retning: 'ned' })
    finnEgg('sno')
  })
  useTastesekvens(['ø', 'n', 's'], () => {
    setByge({ id: Date.now(), retning: 'opp' })
    finnEgg('sno-opp')
  })

  useEffect(() => {
    const onSnofall = (event: Event) => setByge({ id: Date.now(), retning: (event as CustomEvent<Retning>).detail })
    window.addEventListener(SNOFALL_HENDELSE, onSnofall)
    return () => window.removeEventListener(SNOFALL_HENDELSE, onSnofall)
  }, [])

  // Snøkule: rister man telefonen (eller musa på desktop), snør det. På iOS må man først gi lov, se /jule-egg.
  useEffect(() => {
    let topper: number[] = []
    const onBevegelse = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.acceleration ?? {}
      if (x == null || y == null || z == null) {
        return
      }
      const resultat = registrerBevegelse(topper, Math.hypot(x, y, z), event.timeStamp)
      topper = resultat.topper
      if (resultat.ristes) {
        setByge({ id: Date.now(), retning: 'ned' })
        finnEgg('risting')
      }
    }
    let mus = NY_MUSETILSTAND
    const onMus = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return
      }
      const resultat = registrerMusebevegelse(mus, event.clientX, event.timeStamp)
      mus = resultat.tilstand
      if (resultat.ristes) {
        setByge({ id: Date.now(), retning: 'ned' })
        finnEgg('risting')
      }
    }
    window.addEventListener('devicemotion', onBevegelse)
    window.addEventListener('pointermove', onMus)
    return () => {
      window.removeEventListener('devicemotion', onBevegelse)
      window.removeEventListener('pointermove', onMus)
    }
  }, [])

  useEffect(() => {
    if (!byge) {
      return
    }
    const timeout = setTimeout(() => setByge(null), VARIGHET_MS)
    return () => clearTimeout(timeout)
  }, [byge])

  return byge ? <Snobyge key={byge.id} retning={byge.retning} /> : null
}
