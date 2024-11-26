import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { LinkToArchive } from '~/components/LinkToArchive'
import { CalendarBackgroundSVG } from '~/features/calendar/CalendarBackgroundSVG'
import { Gift2SVG } from '~/features/calendar/Gift2SVG'
import { Gift3SVG } from '~/features/calendar/Gift3SVG'
import { GiftsSVG } from '~/features/calendar/GiftsSVG'
import useMediaQuery from '~/hooks/useMediaQuery'

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
  const smallScreen = useMediaQuery('(max-width: 640px)')

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <CalendarBackgroundSVG smallScreen={smallScreen} />
      </div>
      <div className="p-4">
        <h1 className="text-reindeer-brown font-delicious text-center text-4xl sm:text-6xl pb-8 sm:pb-0">
          24 dager med brev - {data.year}
        </h1>

        <div className="flex justify-center">
          <div className="hidden sm:flex self-end">
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

          <div className="max-sm:w-full max-sm:px-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 md:px-0">
              <div className="col-span-3 sm:col-span-6 row-start-1 hidden sm:flex justify-end">
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -2, 2, 0],
                    y: -6,
                  }}
                  whileTap={{
                    scale: 0.9,
                    rotate: -8,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 15,
                  }}
                >
                  <GiftsSVG />
                </motion.div>
              </div>
              {Array.from({ length: 24 }, (_, i) => {
                const date = i + 1
                const formattedDate = (i + 1).toString().padStart(2, '0')
                return (
                  <Link
                    to={`/${data.year}/${formattedDate}`}
                    key={date}
                    className="md:text-mega-size text-display-desktop font-delicious border aspect-square flex md:p-8 justify-center items-center "
                  >
                    {date}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="hidden sm:flex self-end">
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
        <LinkToArchive />
        <div className={'pt-8 flex justify-center '}>
          <p>
            Du kan også lese innlegg sorter på{' '}
            <a className={'hover:text-reindeer-brown underline'} href={'/tags'}>
              kategorier
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
