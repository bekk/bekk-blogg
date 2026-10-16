import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { finnEgg } from '~/features/jule-egg/lager'

/** Hvor lenge man må holde musepekeren over før støvet blåser vekk */
const BLASETID_MS = 1500

/** Jule-egg i arkivet: de eldste kalenderne er dekket av støv og spindelvev, som blåser vekk hvis man venter litt */
export const Stovete = ({ children }: { children: ReactNode }) => {
  const [blast, setBlast] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const start = () => {
    timeout.current = setTimeout(() => {
      setBlast(true)
      finnEgg('arkivstov')
    }, BLASETID_MS)
  }
  const avbryt = () => clearTimeout(timeout.current)

  return (
    <div className="relative" onPointerEnter={start} onPointerLeave={avbryt}>
      {children}
      <AnimatePresence>
        {!blast && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2"
            exit={{ opacity: 0, x: 80, y: -30, rotate: 8, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div
              className="absolute inset-0 rounded-lg opacity-70"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(120,110,100,0.55) 1px, transparent 1.5px), radial-gradient(circle, rgba(90,80,70,0.4) 1px, transparent 1.5px)',
                backgroundSize: '9px 9px, 13px 13px',
                backgroundPosition: '0 0, 4px 6px',
                backgroundColor: 'rgba(200,190,180,0.25)',
              }}
            />
            <span className="absolute -left-1 -top-2 text-3xl">🕸️</span>
            <span className="absolute -bottom-2 -right-1 rotate-180 text-2xl">🕸️</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
