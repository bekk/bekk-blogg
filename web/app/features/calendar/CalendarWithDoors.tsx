import { Link, useLoaderData } from 'react-router'
import { motion } from 'framer-motion'
import { Search } from '~/components/Search'

import { Door } from '~/features/calendar/Door'
import { Gift2SVG } from '~/features/calendar/giftsSVG/Gift2SVG'
import { Gift3SVG } from '~/features/calendar/giftsSVG/Gift3SVG'

export const CalendarWithDoors = () => {
  const data = useLoaderData<{ year: string }>()
  return (
    <div className="sm:px-4 grid grid-cols-[25px_auto_25px] sm:grid-cols-[50px_auto_50px] 2lg:grid-cols-[auto_auto_auto] grid-rows-[91px_auto] sm:grid-rows-[142px_auto] md:grid-rows-[179px_auto] 2lg:grid-rows-[292px_auto]">
      {/* Roof */}
      <div className="row-start-1 row-span-2 col-start-1 col-span-3 z-5 flex flex-col items-center">
        <h1 className="text-red-berry font-delicious text-center text-2xl sm:text-4xl md:text-5xl mt-[45px] sm:mt-[80px] md:mt-[110px] 2lg:mt-[160px] 2lg:pr-5 mb-4">
          {data.year}
        </h1>
        <div className="text-red-berry hidden 2lg:block">
          <Search />
        </div>
      </div>
      {/* Gift left */}
      <div className="row-start-2 row-span-1 col-start-1 col-span-1 hidden 2lg:flex self-end">
        <motion.div
          whileHover={{
            y: -12,
            rotate: -5,
          }}
          whileTap={{
            scale: 0.85,
            rotate: 10,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <Link to="/julesveiper">
            <Gift3SVG />
          </Link>
        </motion.div>
      </div>
      {/* Calendar */}
      <div className="col-start-2 col-span-1 row-start-2 row-span-1">
        <div className="grid h-full 2lg:grid-cols-[repeat(6,auto)] 2lg:grid-rows-[repeat(4,auto)] md:grid-cols-[repeat(4,auto)] md:grid-rows-[repeat(6,auto)] grid-cols-[repeat(3,auto)] grid-rows-[repeat(8,auto)] justify-center border-8 border-reindeer-brown bg-reindeer-brown">
          {Array.from({ length: 24 }, (_, i) => {
            const date = i + 1
            return (
              <div key={date} className="flex justify-center items-center">
                <Door year={Number(data.year)} date={date} />
              </div>
            )
          })}
        </div>
      </div>
      {/* Gift right */}
      <div className="row-start-2 row-span-1 col-start-3 col-span-1 hidden 2lg:flex self-end">
        <motion.div
          whileHover={{
            scale: 1.15,
            rotate: [0, 8, -8, 0],
            y: -8,
          }}
          whileTap={{
            scale: 0.9,
            rotate: -10,
          }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 15,
          }}
        >
          <Gift2SVG />
        </motion.div>
      </div>
    </div>
  )
}
