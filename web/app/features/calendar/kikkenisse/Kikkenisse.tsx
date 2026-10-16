import { motion } from 'motion/react'

import type { Stadium } from './stadier'

/** Hvor mye av nissen som stikker opp over luka, som andel av høyden */
const SYNLIG: Record<Stadium, number> = {
  kikk: 0.45,
  nei: 0.55,
  liste: 0.8,
  sur: 0.6,
  rumpe: 1,
}

/** Toppkanten av konvolutten i den lukkede luka, målt fra bunnen, som andel av høyden på luka */
const KONVOLUTTKANT = '57.5%'

/** Hvor lenge nissen er oppe, i sekunder */
export const VARIGHET: Record<Stadium, number> = {
  kikk: 1.4,
  nei: 1.8,
  liste: 2.4,
  sur: 2,
  rumpe: 3,
}

const HUD = '#f5c9a8'
const ROD = '#d0332e'
const MORK_ROD = '#a7060e'
const HVIT = '#f7f3ee'
const SVART = '#1f1f1f'
const GRONN = '#164125'

const Lue = () => (
  <>
    <path d="M14 26 Q22 4 46 6 Q36 12 42 26Z" fill={ROD} />
    <rect x="12" y="23" width="32" height="6" rx="3" fill={HVIT} />
    <circle cx="46" cy="6" r="4" fill={HVIT} />
  </>
)

const Bein = () => (
  <>
    <rect x="20" y="68" width="6" height="8" fill={GRONN} />
    <rect x="31" y="68" width="6" height="8" fill={GRONN} />
    <rect x="18" y="75" width="10" height="5" rx="2" fill={SVART} />
    <rect x="30" y="75" width="10" height="5" rx="2" fill={SVART} />
  </>
)

/** Nissen forfra. Hodet rister når han sier nei, og han blir rød i kinna når han er sur. */
const Forfra = ({ stadium }: { stadium: Exclude<Stadium, 'rumpe'> }) => (
  <>
    <Bein />
    <rect x="14" y="48" width="30" height="22" rx="8" fill={ROD} />
    <rect x="14" y="58" width="30" height="4" fill={SVART} />
    <rect x="26" y="57" width="6" height="6" fill="#e0c190" />
    {stadium === 'liste' ? (
      <>
        <rect x="8" y="50" width="7" height="13" rx="3.5" fill={MORK_ROD} />
        {/* Notisblokk og blyant */}
        <rect x="30" y="47" width="16" height="20" rx="1" fill="#fff" stroke={SVART} strokeWidth="0.8" />
        {[52, 56, 60].map((y) => (
          <line key={y} x1="33" x2="43" y1={y} y2={y} stroke="#aeb7ab" strokeWidth="0.8" />
        ))}
        <motion.g
          animate={{ x: [0, 6, 0, 6, 0], y: [0, 0, 4, 4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        >
          <rect x="34" y="44" width="3" height="12" rx="1" fill="#e0c190" transform="rotate(25 35 50)" />
          <rect x="22" y="52" width="14" height="6" rx="3" fill={MORK_ROD} />
        </motion.g>
      </>
    ) : (
      <>
        <rect x="8" y="50" width="7" height="13" rx="3.5" fill={MORK_ROD} />
        <rect x="43" y="50" width="7" height="13" rx="3.5" fill={MORK_ROD} />
      </>
    )}
    <motion.g
      style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.9 }}
      animate={stadium === 'nei' || stadium === 'sur' ? { rotate: [0, -14, 14, -14, 14, 0] } : { rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
    >
      <circle cx="28" cy="34" r="12" fill={HUD} />
      <path d="M16 34 Q16 50 28 50 Q40 50 40 34 Q34 40 28 40 Q22 40 16 34Z" fill={HVIT} />
      <circle cx="23" cy="32" r="1.6" fill={SVART} />
      <circle cx="33" cy="32" r="1.6" fill={SVART} />
      {stadium === 'kikk' ? null : (
        // Øyenbryn som blir sintere og sintere
        <g stroke={SVART} strokeWidth="1.4" strokeLinecap="round">
          <line x1="20" y1={stadium === 'sur' ? 27 : 28.5} x2="25" y2="29.5" />
          <line x1="36" y1={stadium === 'sur' ? 27 : 28.5} x2="31" y2="29.5" />
        </g>
      )}
      {stadium === 'sur' && (
        <>
          <ellipse cx="19" cy="37" rx="3" ry="2" fill="#ed7e87" opacity="0.8" />
          <ellipse cx="37" cy="37" rx="3" ry="2" fill="#ed7e87" opacity="0.8" />
        </>
      )}
      <circle cx="28" cy="36" r="2.2" fill="#ed7e87" />
      <Lue />
    </motion.g>
  </>
)

/** Nissen bakfra, med buksa nede */
const Bakfra = () => (
  <>
    <Bein />
    {/* Buksa nede ved knærne */}
    <rect x="16" y="67" width="26" height="6" rx="2" fill={ROD} />
    <motion.g
      style={{ transformBox: 'fill-box', originX: 0.5, originY: 0 }}
      animate={{ rotate: [0, -10, 10, -10, 10, -10, 10, 0] }}
      transition={{ duration: 1.6, delay: 0.6 }}
    >
      <circle cx="21" cy="59" r="9" fill={HUD} />
      <circle cx="37" cy="59" r="9" fill={HUD} />
      <path d="M29 53 L29 66" stroke="#c99a7e" strokeWidth="1.4" strokeLinecap="round" />
    </motion.g>
    <rect x="14" y="42" width="30" height="13" rx="7" fill={ROD} />
    <rect x="8" y="44" width="7" height="12" rx="3.5" fill={MORK_ROD} />
    <rect x="43" y="44" width="7" height="12" rx="3.5" fill={MORK_ROD} />
    <circle cx="28" cy="32" r="12" fill={HVIT} />
    <g transform="translate(0 -2)">
      <Lue />
    </g>
  </>
)

type KikkenisseProps = {
  stadium: Stadium
  replikk: string | null
  /** Bredden på nissen i piksler */
  bredde: number
}

/**
 * Nissen som stikker hodet opp bak konvolutten i en lukket luke.
 * Plasseres i et element som er `relative` og like stort som luka.
 */
export const Kikkenisse = ({ stadium, replikk, bredde }: KikkenisseProps) => {
  const hoyde = (bredde * 80) / 60
  const synlig = hoyde * SYNLIG[stadium]
  const oppe = VARIGHET[stadium] - 0.6

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
      style={{ width: bredde, height: hoyde, bottom: KONVOLUTTKANT }}
    >
      {replikk && (
        <motion.div
          className="absolute left-1/2 w-max max-w-44 -translate-x-1/2 rounded-lg border border-bekk-night bg-white px-2 py-1 text-center text-xs text-bekk-night shadow-md sm:text-sm"
          style={{ bottom: synlig + 6 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1] }}
          transition={{ duration: VARIGHET[stadium], times: [0, 0.2, 0.85, 1], delay: 0.15 }}
        >
          {replikk}
        </motion.div>
      )}
      {/* Klipper bare nederst, så nissen ser ut til å komme opp bak konvolutten */}
      <div className="absolute inset-0" style={{ clipPath: 'inset(-100vh -100vw 0 -100vw)' }}>
        <motion.svg
          viewBox="0 0 60 80"
          className="absolute left-0 top-0 size-full"
          initial={{ y: hoyde }}
          animate={{ y: [hoyde, hoyde - synlig, hoyde - synlig, hoyde] }}
          transition={{
            duration: VARIGHET[stadium],
            times: [0, 0.3 / VARIGHET[stadium], (0.3 + oppe) / VARIGHET[stadium], 1],
            ease: 'easeInOut',
          }}
        >
          {stadium === 'rumpe' ? <Bakfra /> : <Forfra stadium={stadium} />}
        </motion.svg>
      </div>
    </div>
  )
}
