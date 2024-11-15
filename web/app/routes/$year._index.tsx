import type { MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { Gift2SVG } from '~/features/calendar/Gift2SVG'
import { Gift3SVG } from '~/features/calendar/Gift3SVG'
import { GiftsSVG } from '~/features/calendar/GiftsSVG'

export async function loader({ params }: { params: { year: string } }) {
  const year = parseInt(params.year)
  const currentYear = new Date().getFullYear()

  //TODO: finne ut av når første bekk-christmas posten kommer fra
  if (isNaN(year) || year > currentYear || year < 2017) {
    throw new Response('Invalid year', { status: 404 })
  }
  return { year: params.year }
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
    <div className="p-4">
      <h1 className="text-reindeer-brown font-delicious text-center pb-8 md:pb-0">24 dager med brev - {data.year}</h1>

      <div className="flex justify-center">
        <div className="hidden sm:flex self-end">
          <Gift3SVG />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 px-2 md:px-0">
          <div className="col-span-3 sm:col-span-6 row-start-1 hidden sm:flex justify-end">
            <GiftsSVG />
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
        <div className="hidden sm:flex self-end">
          <Gift2SVG />
        </div>
      </div>
    </div>
  )
}
