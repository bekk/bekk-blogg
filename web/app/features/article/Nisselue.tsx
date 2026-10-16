import { motion } from 'motion/react'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { finnEgg } from '~/features/jule-egg/lager'

const LANGT_TRYKK_MS = 600
/** Beveger man fingeren mer enn dette, scroller man, og da er det ikke et langt trykk */
const MAKS_BEVEGELSE = 10

/** Jule-egg: holder man lenge inne på forsidebildet i en artikkel, faller det ned en nisselue på det */
export const Nisselue = ({ children }: { children: ReactNode }) => {
  const [lue, setLue] = useState(false)
  const trykk = useRef<{ x: number; y: number; timeout: ReturnType<typeof setTimeout> } | null>(null)
  const nettoppFyrt = useRef(false)

  const fyr = () => {
    nettoppFyrt.current = true
    setLue(true)
    finnEgg('nisselue')
  }

  const avbryt = () => {
    if (trykk.current) {
      clearTimeout(trykk.current.timeout)
      trykk.current = null
    }
  }

  const start = (event: PointerEvent) => {
    avbryt()
    nettoppFyrt.current = false
    // Høyreklikk skal gi den vanlige menyen
    if (event.button !== 0) {
      return
    }
    trykk.current = { x: event.clientX, y: event.clientY, timeout: setTimeout(fyr, LANGT_TRYKK_MS) }
  }

  const flytt = (event: PointerEvent) => {
    if (
      trykk.current &&
      Math.hypot(event.clientX - trykk.current.x, event.clientY - trykk.current.y) > MAKS_BEVEGELSE
    ) {
      avbryt()
    }
  }

  return (
    <div
      className="relative select-none [-webkit-touch-callout:none]"
      onPointerDown={start}
      onPointerMove={flytt}
      onPointerUp={avbryt}
      onPointerCancel={avbryt}
      onPointerLeave={avbryt}
      onContextMenu={(event) => {
        // På Android kommer menyen for langt trykk før vi rekker å fyre, så da faller lua med en gang
        if (trykk.current) {
          avbryt()
          fyr()
        }
        // Bare når lua faktisk falt ned, så «Lagre bilde» virker som vanlig ellers
        if (nettoppFyrt.current) {
          event.preventDefault()
        }
      }}
    >
      {children}
      {lue && (
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 120 80"
          className="pointer-events-none absolute left-[8%] top-0 w-[22%] max-w-56"
          initial={{ y: '-120%', rotate: -40, opacity: 0 }}
          animate={{ y: '-35%', rotate: -12, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 9 }}
        >
          <path d="M10 66 Q30 6 92 10 Q72 26 96 66Z" fill="#d0332e" />
          <rect x="4" y="60" width="98" height="16" rx="8" fill="#f7f3ee" />
          <circle cx="98" cy="12" r="11" fill="#f7f3ee" />
        </motion.svg>
      )}
    </div>
  )
}
