import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { DoorSignLink } from '~/components/DoorSignLink'
import { BekkLogo } from '~/features/article/BekkLogo'
import { Door } from '~/features/calendar/Door'
import { Gift2SVG } from '~/features/calendar/giftsSVG/Gift2SVG'
import { Gift3SVG } from '~/features/calendar/giftsSVG/Gift3SVG'

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
    throw new Response('Invalid year', { status: 404 })
  }
  if (paramsYearAsNumber > currentYear) {
    throw new Response('Year not yet available', { status: 425 })
  }
  return { year }
}

export const meta: MetaFunction = ({ data }) => {
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
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]
}

export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  }
}

export default function YearRoute() {
  const data = useLoaderData<{ year: string }>()

  return (
    <div className="2lg:h-screen flex justify-center items-center">
      <Link to="/post/2024" className="absolute top-[20px] md:top-[40px] right-[20px] md:right-[40px]">
        <BekkLogo className="h-auto w-10 md:auto md:w-16" />
      </Link>
      <div className="sm:px-4 grid grid-cols-[25px_auto_25px] sm:grid-cols-[50px_auto_50px] 2lg:grid-cols-[auto_auto_auto] grid-rows-[91px_auto_auto] sm:grid-rows-[142px_auto_auto] md:grid-rows-[179px_auto_auto] 2lg:grid-rows-[292px_auto_137px]">
        {/* Roof */}
        <div className="bg-roof row-start-1 row-span-2 col-start-1 col-span-3">
          <h1 className="text-postcard-beige font-delicious text-center text-2xl sm:text-4xl md:text-5xl mt-[45px] sm:mt-[80px] md:mt-[110px] 2lg:mt-[180px]">
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
          <div className="grid h-full 2lg:grid-cols-[repeat(6,auto)] 2lg:grid-rows-[repeat(4,auto)] md:grid-cols-[repeat(4,auto)] md:grid-rows-[repeat(6,auto)] grid-cols-[repeat(3,auto)] grid-rows-[repeat(8,auto)] justify-center border-8 border-reindeer-brown">
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
        {/* Bottom */}
        <div className="bg-plank row-start-3 row-span-1 col-start-1 col-span-3 border-reindeer-brown flex justify-center flex-col md:flex-row items-center gap-8 py-6">
          <DoorSignLink link="/archive">Se andre julekalendere</DoorSignLink>
          <DoorSignLink link="/kategori">Se kategorier</DoorSignLink>
        </div>
      </div>
    </div>
  )
}
