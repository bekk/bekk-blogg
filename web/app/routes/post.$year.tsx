import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { BekkLogo } from '~/features/article/BekkLogo'
import { BottomPlank } from '~/features/calendar/BottomPlank'
import { Door } from '~/features/calendar/Door'
import { Gift2SVG } from '~/features/calendar/giftsSVG/Gift2SVG'
import { Gift3SVG } from '~/features/calendar/giftsSVG/Gift3SVG'
import { SnowAnimation } from '~/features/calendar/SnowAnimation'

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', { status: 400 })
  }
  const { year } = parsedParams.data
  const currentYear = new Date().getFullYear()
  const paramsYearAsNumber = Number.parseInt(year)

  if (isNaN(paramsYearAsNumber) || paramsYearAsNumber < 2017) {
    throw new Response('Invalid year', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  if (paramsYearAsNumber > currentYear) {
    throw new Response('Year not yet available', {
      status: 425,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  return { year }
}

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return []
  }
  const { year } = data as { year: string }
  const title = `Bekk Christmas ${year}`
  const description = `Se alle innlegg fra Bekks julekalender ${year}`

  return [
    { title },
    { name: 'description', content: description },
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export default function YearRoute() {
  const data = useLoaderData<{ year: string }>()

  return (
    <div className="2lg:h-screen flex flex-col justify-end items-center min-h-screen">
      <SnowAnimation />
      <Link to="/post/2024" className="absolute top-[20px] md:top-[40px] right-[20px] md:right-[40px]">
        <BekkLogo className="h-auto w-10 md:auto md:w-16" />
      </Link>
      <div className="sm:px-4 grid grid-cols-[25px_auto_25px] sm:grid-cols-[50px_auto_50px] 2lg:grid-cols-[auto_auto_auto] grid-rows-[91px_auto] sm:grid-rows-[142px_auto] md:grid-rows-[179px_auto] 2lg:grid-rows-[292px_auto]">
        {/* Roof */}
        <div className="bg-roof row-start-1 row-span-2 col-start-1 col-span-3 z-5">
          <h1 className="text-postcard-beige font-delicious text-center text-2xl sm:text-4xl md:text-5xl mt-[45px] sm:mt-[80px] md:mt-[110px] 2lg:mt-[180px] 2lg:pr-5">
            {data.year}
          </h1>
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
            <Gift3SVG />
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
      {/* Bottom plank*/}
      <div className="w-full">
        <div id="bottom" className={'relative w-screen left-1/2 right-1/2 transform -translate-x-1/2'}>
          <BottomPlank />
        </div>
      </div>
    </div>
  )
}
