import { useEffect, useState } from 'react'
import { SNOFNUGG } from '~/features/calendar/SnowAnimation'
import { useTastesekvens } from '~/hooks/useTastesekvens'

import './snofall.css'

const ANTALL_FNUGG = 80
/** Lengste forsinkelse pluss lengste varighet, så alle fnuggene rekker å komme fram */
const VARIGHET_MS = 14_000

type Retning = 'ned' | 'opp'

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

/** Easter egg: skriver man «snø» et sted på siden, snør det. Skriver man «øns», snør det oppover. */
export const Snofall = () => {
  const [byge, setByge] = useState<{ id: number; retning: Retning } | null>(null)

  useTastesekvens(['s', 'n', 'ø'], () => setByge({ id: Date.now(), retning: 'ned' }))
  useTastesekvens(['ø', 'n', 's'], () => setByge({ id: Date.now(), retning: 'opp' }))

  useEffect(() => {
    if (!byge) {
      return
    }
    const timeout = setTimeout(() => setByge(null), VARIGHET_MS)
    return () => clearTimeout(timeout)
  }, [byge])

  return byge ? <Snobyge key={byge.id} retning={byge.retning} /> : null
}
