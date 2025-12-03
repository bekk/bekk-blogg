import { motion } from 'framer-motion'
import { OpenDoorSvg } from './OpenDoorSVG'
import { TodaysDoorSVG } from './TodaysDoorSVG'

export const OpenDoor = ({
  date,
  width,
  height,
  giftWrappingColor,
  giftRibbonColor,
  isToday,
}: {
  date: number
  height: number
  width: number
  giftWrappingColor: string
  giftRibbonColor: string
  isToday: boolean
}) => {
  return (
    <motion.div initial="rest" whileHover="hover">
      <div
        className="relative border-calendar-door-border-green border-[10px] sm:border-[15px] border-b-[#3A4B35] bg-calendar-door-fill-green"
        style={{ width, height }}
      >
        <motion.div
          variants={{
            rest: { scale: 1, x: '-50%' },
            hover: { scale: 1.1, x: '-50%', transition: { duration: 0.2 } },
          }}
          className="absolute bottom-[-10px] sm:bottom-[-15px] left-[50%]"
        >
          {isToday ? (
            <TodaysDoorSVG date={date} width={width} height={height} />
          ) : (
            <OpenDoorSvg
              date={date}
              width={width}
              height={height}
              giftWrappingColor={giftWrappingColor}
              giftRibbonColor={giftRibbonColor}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
