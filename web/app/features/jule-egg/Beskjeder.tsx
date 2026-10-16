import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NisseFigur } from '~/components/NisseFigur'
import { RudolfFigur } from '~/components/RudolfFigur'

const BESKJED_HENDELSE = 'jule-egg-beskjed'
/** Hvor lenge en beskjed vises, i millisekunder */
const VISNINGSTID = 4500

export type Beskjed = {
  figur: 'rudolf' | 'nisse' | 'sovende-nisse'
  tekst: string
}

/** Lar en figur titte opp nede i hjørnet og si noe */
export const visBeskjed = (beskjed: Beskjed) =>
  window.dispatchEvent(new CustomEvent<Beskjed>(BESKJED_HENDELSE, { detail: beskjed }))

const Figur = ({ figur }: { figur: Beskjed['figur'] }) => {
  if (figur === 'rudolf') {
    return <RudolfFigur />
  }
  return (
    <div className="relative size-full pt-2">
      <NisseFigur />
      {figur === 'sovende-nisse' && (
        <motion.span
          className="absolute -top-2 right-0 text-lg font-bold text-bekk-night"
          animate={{ opacity: [0, 1, 0], y: [6, -6, -12] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          z<span className="text-sm">z</span>
          <span className="text-xs">z</span>
        </motion.span>
      )}
    </div>
  )
}

/** Viser beskjedene fra `visBeskjed`, én om gangen. Monteres én gang i appen. */
export const Beskjeder = () => {
  const [beskjed, setBeskjed] = useState<(Beskjed & { id: number }) | null>(null)

  useEffect(() => {
    const onBeskjed = (event: Event) => setBeskjed({ ...(event as CustomEvent<Beskjed>).detail, id: Date.now() })
    window.addEventListener(BESKJED_HENDELSE, onBeskjed)
    return () => window.removeEventListener(BESKJED_HENDELSE, onBeskjed)
  }, [])

  useEffect(() => {
    if (!beskjed) {
      return
    }
    const timeout = setTimeout(() => setBeskjed(null), VISNINGSTID)
    return () => clearTimeout(timeout)
  }, [beskjed])

  return (
    <AnimatePresence>
      {beskjed && (
        <motion.div
          key={beskjed.id}
          className="pointer-events-none fixed bottom-0 right-4 z-40 flex items-start gap-2 sm:right-10"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p
            role="status"
            className="mt-2 max-w-48 rounded-lg border border-bekk-night bg-white px-3 py-2 text-sm text-bekk-night shadow-md"
          >
            {beskjed.tekst}
          </p>
          <div className="h-27 w-24 sm:h-34 sm:w-30">
            <Figur figur={beskjed.figur} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
