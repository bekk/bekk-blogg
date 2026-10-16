import { motion } from 'motion/react'

/** Rudolf med lysende nese. Halsen går helt ned til kanten, så han kan titte opp fra bunnen av skjermen. */
export const RudolfFigur = () => (
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
