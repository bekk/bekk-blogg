import { useEffect, useState } from 'react'
import { NisseFigur } from '~/components/NisseFigur'
import { finnEgg } from '~/features/jule-egg/lager'

import '~/features/jule-egg/jule-egg.css'

/** Hvor lenge man må være på siden før sleden kommer, og hvor lang tid den bruker over skjermen */
const VENTETID_MS = 5000
const FLYTID_S = 9

const Reinsdyr = ({ x }: { x: number }) => (
  <g transform={`translate(${x} 0)`}>
    {/* Gevir */}
    <path d="M8 14 L4 4 M4 8 L0 6 M10 14 L12 4 M12 8 L16 6" stroke="#714319" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="9" cy="18" rx="5" ry="4" fill="#8a5a2b" />
    <circle cx="4" cy="19" r="2" fill="#d0332e" />
    <ellipse cx="22" cy="26" rx="12" ry="6" fill="#8a5a2b" />
    <path d="M12 22 L10 18" stroke="#8a5a2b" strokeWidth="4" strokeLinecap="round" />
    {/* Bein i galopp */}
    <path d="M14 30 L8 38 M18 31 L16 40 M28 31 L32 39 M31 30 L38 36" stroke="#714319" strokeWidth="2.5" />
  </g>
)

/** Jule-egg: på kalendere der alle lukene er åpnet, flyr nissen forbi med sleden etter en liten stund */
export const Slede = () => {
  const [flyr, setFlyr] = useState(false)

  useEffect(() => {
    const start = setTimeout(() => {
      setFlyr(true)
      finnEgg('sleden')
    }, VENTETID_MS)
    return () => clearTimeout(start)
  }, [])

  if (!flyr) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="jule-egg-slede pointer-events-none fixed left-0 top-24 z-30 flex items-end motion-reduce:hidden"
      style={{ animation: `jule-egg-slede ${FLYTID_S}s linear both` }}
      onAnimationEnd={() => setFlyr(false)}
    >
      <svg viewBox="0 0 100 42" className="h-12 w-28 overflow-visible sm:h-16 sm:w-38">
        <Reinsdyr x={0} />
        <Reinsdyr x={48} />
        {/* Seletøy */}
        <path d="M34 26 Q42 22 48 26 M82 26 Q92 28 100 30" stroke="#a7060e" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="relative -ml-1 h-16 w-20 sm:h-20 sm:w-24">
        {/* Nissen og sleden er tegnet mot høyre, men flyr mot venstre */}
        <div className="absolute bottom-5 left-5 h-12 w-9 -scale-x-100 sm:h-14 sm:w-11">
          <NisseFigur />
        </div>
        <svg viewBox="0 0 60 30" className="absolute bottom-0 left-0 w-full -scale-x-100">
          <path d="M4 4 L52 4 Q58 4 56 14 L52 22 L8 22 Z" fill="#a7060e" />
          <path d="M2 28 L54 28 Q60 28 58 22" stroke="#e0c190" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M12 22 L12 28 M44 22 L44 28" stroke="#e0c190" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
