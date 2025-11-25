import {
  isRouteErrorResponse,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useRouteError,
} from 'react-router'
import { z } from 'zod'
import { Search } from '~/components/Search'

import { BekkLogo } from '~/features/article/BekkLogo'
import { CalendarWithDoors } from '~/features/calendar/CalendarWithDoors'
import { ErrorPage } from '~/features/error-boundary/ErrorPage'

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', {
      status: 400,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  const { year } = parsedParams.data
  const currentYear = new Date().getFullYear()
  const paramsYearAsNumber = Number(year)

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
    <div className="bg-soft-pink min-h-screen pb-12">
      <Link to="/post/2025" className="absolute top-[20px] md:top-[40px] left-[20px] md:left-[40px]">
        <BekkLogo className="h-auto w-10 md:auto md:w-16 text-red-berry" />
      </Link>

      <div className="flex flex-col gap-8">
        <div className="flex justify-center pt-[20px] md:pt-[40px] text-headline-desktop text-red-berry">
          {data.year}
        </div>

        <div className="flex justify-center">
          <Search transparent={true} />
        </div>

        <div className="2lg:h-auto flex flex-col items-center">
          <CalendarWithDoors />
        </div>
      </div>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 400:
      case 404: {
        return (
          <ErrorPage
            title="Her var det noe feil med året"
            description="Året du prøvde å nå er ikke gyldig. Følg Bekk-stjernen tilbake til julekalenderen."
          />
        )
      }
      case 425:
        return (
          <ErrorPage
            title="Nå var du litt tidlig ute"
            description="Den julekalenderen er ikke tilgjengelig helt enda. Prøv igjen i fremtiden!"
          />
        )
      default:
        return (
          <ErrorPage
            title="Uventet feil"
            description="Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen."
          />
        )
    }
  }
  return (
    <ErrorPage
      title="Uventet feil"
      description="Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen."
    />
  )
}
