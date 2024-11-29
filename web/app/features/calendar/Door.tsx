import { useState } from 'react'
import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'

import { closedDoorSvg } from './doorsSVG/ClosedDoorSVG'
import { openDoorSvg } from './doorsSVG/OpenDoorSVG'
import { todaysDoor } from './doorsSVG/TodaysDoorSVG'

import { LetterSVG } from '~/features/calendar/doorsSVG/LetterSVG'
import useMediaQuery from '~/hooks/useMediaQuery'

type DoorProps = {
  date: number
  year: number
}
export const Door = ({ date, year }: DoorProps) => {
  const smallScreen = useMediaQuery('(max-width: 640px)')
  const [isHovered, setIsHovered] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const isOpenable = () => {
    const today = new Date()
    const doorDate = new Date(year, 11, date)
    return doorDate <= today
  }

  const isToday = () => {
    const today = new Date()
    const doorDate = new Date(year, 11, date)
    return doorDate.toDateString() === today.toDateString()
  }

  const shakeAnimation = {
    shaking: {
      x: [-3, 3, -3, 3, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  const handleClick = () => {
    if (!isOpenable()) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      animate={isShaking ? 'shaking' : ''}
      variants={shakeAnimation}
      initial={{ x: 0 }}
      exit={{ x: 0 }}
      className={`relative ${isHovered && isOpenable() ? ' absolute' : ''}`}
    >
      <Link
        to={isOpenable() ? `/post/${year}/${date.toString().padStart(2, '0')}` : '#'}
        key={date}
        className="flex justify-center items-center border-4 border-reindeer-brown"
      >
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className={`relative z-10`}>
            {isToday() && !isHovered && (
              <div className="absolute inset-0 flex justify-center items-center z-[-1]">
                <div className="transform scale-50 mt-[-112px] ml-[28px]">
                  <LetterSVG />
                </div>
              </div>
            )}
            {isHovered && isOpenable()
              ? smallScreen
                ? isToday()
                  ? todaysDoor(90, 90)
                  : openDoorSvg(90, 90)
                : isToday()
                  ? todaysDoor(140, 140)
                  : openDoorSvg(140, 140)
              : smallScreen
                ? closedDoorSvg(90, 90)
                : closedDoorSvg(140, 140)}
            <div
              className={`absolute top-[7%] right-[0px] left-[0px] m-auto text-center text-display-mobile text-ruben-red md:text-headline-desktop font-source-serif-bold ${
                isHovered && isOpenable() ? 'hidden' : 'block'
              }`}
            >
              {date}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
