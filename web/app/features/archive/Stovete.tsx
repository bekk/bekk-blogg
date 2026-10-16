import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { finnEgg } from '~/features/jule-egg/lager'

/** Hvor lenge man må holde musepekeren over før støvet blåser vekk */
const BLASETID_MS = 1500

/** Jule-egg i arkivet: de eldste kalenderne er dekket av støv og spindelvev, som blåser vekk hvis man venter litt */
export const Stovete = ({ children }: { children: ReactNode }) => {
  const [blast, setBlast] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const blas = () => {
    setBlast(true)
    finnEgg('arkivstov')
  }
  const start = () => {
    timeout.current = setTimeout(blas, BLASETID_MS)
  }
  const avbryt = () => clearTimeout(timeout.current)

  return (
    <div className="relative" onPointerEnter={start} onPointerLeave={avbryt}>
      {children}
      <AnimatePresence>
        {!blast && (
          <motion.div
            className="pointer-events-none absolute -inset-2"
            exit={{ opacity: 0, x: 80, y: -30, rotate: 8, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-lg opacity-70"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(120,110,100,0.55) 1px, transparent 1.5px), radial-gradient(circle, rgba(90,80,70,0.4) 1px, transparent 1.5px)',
                backgroundSize: '9px 9px, 13px 13px',
                backgroundPosition: '0 0, 4px 6px',
                backgroundColor: 'rgba(200,190,180,0.25)',
              }}
            />
            {/* På mobil kan man ikke holde musa over, så der tørker man støv ved å trykke på spindelvevet */}
            <button
              type="button"
              aria-label="Tørk av støvet"
              className="pointer-events-auto absolute -left-1 -top-2 text-3xl"
              onClick={blas}
            >
              🕸️
            </button>
            <button
              type="button"
              aria-label="Tørk av støvet"
              className="pointer-events-auto absolute -bottom-2 -right-1 rotate-180 text-2xl"
              onClick={blas}
            >
              🕸️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
