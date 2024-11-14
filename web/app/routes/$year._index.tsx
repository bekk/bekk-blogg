import type { MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

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
      <h1>{data.year}</h1>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 24 }, (_, i) => {
          const date = i + 1
          const formattedDate = (i + 1).toString().padStart(2, '0')
          return (
            <Link to={`/${data.year}/${formattedDate}`} key={i}>
              Luke {date}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
