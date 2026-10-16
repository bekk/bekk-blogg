import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Hvor lenge Rudolf blir stående, i millisekunder */
const VISNINGSTID = 4500

const replikk = {
  norwegian: 'Du leste hele! Det er det bare 12 % som gjør.',
  english: 'You read the whole thing! Only 12 % of readers do that.',
}

const RudolfFigur = () => (
  <svg viewBox="0 0 80 90" className="size-full" aria-hidden="true">
    {/* Gevir */}
    <g stroke="#714319" strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M28 30 Q20 18 14 4 M20 17 Q12 16 6 12 M17 10 Q22 6 22 2" />
      <path d="M52 30 Q60 18 66 4 M60 17 Q68 16 74 12 M63 10 Q58 6 58 2" />
    </g>
    {/* Ører */}
    <ellipse cx="20" cy="38" rx="9" ry="5" fill="#8a5a2b" transform="rotate(-25 20 38)" />
    <ellipse cx="60" cy="38" rx="9" ry="5" fill="#8a5a2b" transform="rotate(25 60 38)" />
    {/* Hode og snute */}
    <ellipse cx="40" cy="52" rx="20" ry="22" fill="#8a5a2b" />
    <ellipse cx="40" cy="68" rx="14" ry="12" fill="#c49a6c" />
    <circle cx="32" cy="46" r="3" fill="#1f1f1f" />
    <circle cx="48" cy="46" r="3" fill="#1f1f1f" />
    <circle cx="33" cy="45" r="1" fill="#fff" />
    <circle cx="49" cy="45" r="1" fill="#fff" />
    <path d="M34 73 Q40 77 46 73" stroke="#1f1f1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Nesa som lyser */}
    <motion.circle
      cx="40"
      cy="63"
      r="6"
      fill="#d0332e"
      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.15, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{ filter: 'drop-shadow(0 0 4px #ff5a52)' }}
    />
    {/* Halsen fortsetter ned under kanten av skjermen */}
    <rect x="26" y="70" width="28" height="20" fill="#8a5a2b" />
  </svg>
)

/**
 * Easter egg i artikler: når man har scrollet helt til bunnen av artikkelen,
 * titter Rudolf opp nede i hjørnet og gratulerer. Bare én gang per artikkel.
 */
export const Rudolf = ({ language }: { language?: string | null }) => {
  const markor = useRef<HTMLDivElement>(null)
  const [synlig, setSynlig] = useState(false)

  useEffect(() => {
    const element = markor.current
    if (!element) {
      return
    }
    // Sjekker ved scroll i stedet for med IntersectionObserver, siden End-tasten og raske scroll kan hoppe forbi bunnen
    const onScroll = () => {
      // Krever at man har scrollet, så korte artikler som får plass på skjermen ikke teller
      if (element.getBoundingClientRect().top < window.innerHeight && window.scrollY > window.innerHeight / 2) {
        setSynlig(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!synlig) {
      return
    }
    const timeout = setTimeout(() => setSynlig(false), VISNINGSTID)
    return () => clearTimeout(timeout)
  }, [synlig])

  return (
    <>
      <div ref={markor} aria-hidden="true" />
      <AnimatePresence>
        {synlig && (
          <motion.div
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
              {replikk[language === 'en-US' ? 'english' : 'norwegian']}
            </p>
            <div className="h-27 w-24 sm:h-34 sm:w-30">
              <RudolfFigur />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
