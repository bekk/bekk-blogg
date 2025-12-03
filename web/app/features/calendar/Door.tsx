import { useState } from 'react'
import { ClosedDoorSvg } from './doorsSVG/ClosedDoorSVG'
import { Link } from 'react-router'
import { motion, Variants } from 'framer-motion'

import useMediaQuery from '~/hooks/useMediaQuery'
import { OpenDoor } from './doorsSVG/OpenDoor'

const today = new Date()

type DoorProps = {
  date: number
  year: number
}

const giftWrappingPalette = ['#A7060E', '#6D0D22', '#AEB7AB']
const giftRibbonPalette = ['#ED7E87', '#ED7E87', '#D9DCCF']

export const Door = ({ date, year }: DoorProps) => {
  const [isShaking, setIsShaking] = useState(false)
  const [colorIndex] = useState(() => Math.floor(Math.random() * giftWrappingPalette.length))

  const smallScreen = useMediaQuery('(max-width: 640px)')

  const isOpenable = new Date(year, 11, date) <= today
  const isToday = new Date(year, 11, date).toDateString() === today.toDateString()

  const doorSize = smallScreen ? { width: 90, height: 90 } : { width: 140, height: 140 }

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
    <Link to={'#'} key={date} className="flex justify-center items-center" aria-label={`Luke ${date} er lukket`}>
      <div className={`relative z-10`}>
        <motion.div
          onClick={handleClick}
          animate={isShaking ? 'shaking' : ''}
          variants={shakeAnimation}
          initial={{ x: 0 }}
          exit={{ x: 0 }}
          aria-label={`Luke ${date}${isOpenable ? '' : ' er lukket'}`}
        >
          <ClosedDoorSvg date={date} {...doorSize} />
        </motion.div>
      </div>
    </Link>
  )
}
