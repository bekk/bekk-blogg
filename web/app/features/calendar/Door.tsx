import { useEffect, useState } from 'react'
import { ClosedDoorSvg } from './doorsSVG/ClosedDoorSVG'
import { Link } from 'react-router'
import { motion, Variants } from 'motion/react'

import useMediaQuery from '~/hooks/useMediaQuery'
import { useTextZoomScale } from '~/hooks/useTextZoomScale'
import { trackEvent } from 'utils/analytics'
import { getDoorDate, isDoorOpen } from 'utils/calendar'
import { OpenDoor } from './doorsSVG/OpenDoor'
import { Kikkenisse, VARIGHET } from './kikkenisse/Kikkenisse'
import { replikkFor, stadiumFor, type Stadium } from './kikkenisse/stadier'

type DoorProps = {
  date: number
  year: number
  /** Dagens dato i norsk tid (YYYY-MM-DD). Må komme fra loaderen, så server og klient er enige. */
  today: string
}

const giftWrappingPalette = ['#A7060E', '#6D0D22', '#AEB7AB']
const giftRibbonPalette = ['#ED7E87', '#ED7E87', '#D9DCCF']

export const Door = ({ date, year, today }: DoorProps) => {
  const [isShaking, setIsShaking] = useState(false)
  const [colorIndex] = useState(() => Math.floor(Math.random() * giftWrappingPalette.length))
  // Easter egg: klikker man mye på en lukket luke, dukker det opp en stadig mer sassy nisse
  const [klikk, setKlikk] = useState(0)
  const [nisse, setNisse] = useState<{ id: number; stadium: Stadium; replikk: string | null } | null>(null)

  useEffect(() => {
    if (!nisse) {
      return
    }
    const timeout = setTimeout(() => setNisse(null), VARIGHET[nisse.stadium] * 1000)
    return () => clearTimeout(timeout)
  }, [nisse])

  const smallScreen = useMediaQuery('(max-width: 640px)')
  const textZoomScale = useTextZoomScale()

  const isOpenable = isDoorOpen(year, date, today)
  const isToday = getDoorDate(year, date) === today

  const baseSize = smallScreen ? { width: 90, height: 90 } : { width: 140, height: 140 }
  const doorSize = {
    width: Math.round(baseSize.width * textZoomScale),
    height: Math.round(baseSize.height * textZoomScale),
  }

  const shakeAnimation: Variants = {
    shaking: {
      x: [-3, 3, -3, 3, 0],
      transition: {
        duration: 0.2,
        ease: ['easeInOut'],
      },
    },
  }

  const handleClick = () => {
    if (!isOpenable) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)

      const antall = klikk + 1
      const stadium = stadiumFor(antall)
      if (stadium) {
        setNisse({ id: antall, stadium, replikk: replikkFor(antall, date) })
      }
      if (stadium === 'rumpe') {
        trackEvent('easter_egg_kikkenisse_rumpe', { luke: date })
        setKlikk(0)
      } else {
        setKlikk(antall)
      }
    }
  }

  if (isOpenable) {
    return (
      <Link
        to={`/post/${year}/${date.toString().padStart(2, '0')}`}
        key={date}
        className="flex justify-center items-center isolated"
        aria-label={`Luke ${date}`}
      >
        <div className={`relative z-10`}>
          <OpenDoor
            giftWrappingColor={giftWrappingPalette[colorIndex]}
            giftRibbonColor={giftRibbonPalette[colorIndex]}
            date={date}
            isToday={isToday}
            {...doorSize}
          />
        </div>
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="flex justify-center items-center"
      aria-label={`Luke ${date} er lukket`}
      aria-disabled="true"
      // En knapp håndterer Enter og mellomrom selv
      onClick={handleClick}
    >
      <div className={`relative z-10`}>
        <motion.div animate={isShaking ? 'shaking' : ''} variants={shakeAnimation} initial={{ x: 0 }} exit={{ x: 0 }}>
          <ClosedDoorSvg date={date} {...doorSize} />
        </motion.div>
        {nisse && (
          <Kikkenisse key={nisse.id} stadium={nisse.stadium} replikk={nisse.replikk} bredde={doorSize.width * 0.5} />
        )}
      </div>
      <span role="status" className="sr-only">
        {nisse?.replikk ? `Nissen sier: ${nisse.replikk}` : ''}
      </span>
    </button>
  )
}
