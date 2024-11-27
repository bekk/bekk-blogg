import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'

import { Door } from '~/features/calendar/Door'
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
    <>
      {/* <h1 className="text-reindeer-brown font-delicious text-center text-4xl sm:text-6xl pb-8 sm:pb-0">
          {data.year}
        </h1> */}
      <div className="h-screen px-4 grid grid-cols-[auto_auto_auto] grid-rows-[240px_auto_137px]">
        {/* Tak */}
        <div className="bg-roof row-start-1 row-span-1 col-start-1 col-span-3">tak</div>
        {/* Gave V.S */}
        {/* <div className="row-start-2 row-span-1 col-start-1 col-span-1 hidden md:flex self-end">
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
        </div> */}
        {/* Kalender */}
        <div className="col-start-2 col-span-1 row-start-2 row-span-1">
          <div className="grid gap-[8px] md:grid-cols-[repeat(6,160px)] md:grid-rows-[repeat(4,160px)] grid-cols-[repeat(3,100px)] grid-rows-[repeat(8,100px)] justify-center border-8 border-reindeer-brown">
            {Array.from({ length: 24 }, (_, i) => {
              const date = i + 1
              return (
                <div key={date} className="flex justify-center items-center">
                  <Door year={Number(data.year)} date={date} smallScreen={smallScreen} />
                </div>
              )
            })}
          </div>
        </div>
        {/* Gave H.S */}
        {/* <div className="row-start-2 row-span-1 col-start-3 col-span-1 hidden md:flex self-end">
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
        </div> */}
        {/* Bunn */}
        <div className="bg-plank row-start-3 row-span-1 col-start-2 col-span-1border-reindeer-brown">bunn</div>
      </div>
      {/* <LinkToArchive />
      <div className={'pt-8 flex justify-center text-center'}>
        <p>
          Du kan også lese innlegg sorter på{' '}
          <Link className={'hover:text-reindeer-brown underline'} to={'/kategori'}>
            kategorier
          </Link>
        </p>
      </div> */}
    </>
  )
}
