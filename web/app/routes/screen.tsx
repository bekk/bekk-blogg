import {
  isRouteErrorResponse,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useLoaderData,
  useRouteError,
} from 'react-router'
import { combinedHeaders } from 'utils/headers'
import { isNumericString } from 'utils/numbers'
import { loadQuery } from 'utils/sanity/loader.server'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { POSTS_BY_YEAR_AND_DATE } from 'utils/sanity/queries/postQueries'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'

import { ErrorPage } from '~/features/error-boundary/ErrorPage'
import { useScreenPagination } from '../hooks/useScreenPagination'
import { LandscapeView } from '~/features/screen/LandscapeView'
import { PortraitView } from '~/features/screen/PortraitView'

const ROTATION_INTERVAL_DEFAULT = 30

export const meta: MetaFunction = () => {
  const title = `Forhåndsvisning av årets Bekk Christmas`
  const description = `Forhåndsvisning av årets Bekk Christmas julekalender for skjermpresentasjon`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const amountParam = url.searchParams.get('articleAmount')
  const pageParam = url.searchParams.get('articlePage')
  const rotationIntervalParam = url.searchParams.get('rotationInterval')
  const dateOverrideParam = url.searchParams.get('dateOverride')

  const today = new Date()
  const targetDate = dateOverrideParam ? new Date(dateOverrideParam) : today
  const year = targetDate.getFullYear().toString()
  const date = (targetDate.getMonth() === 11 ? targetDate.getDate() : 0).toString()

  const { preview } = await loadQueryOptions(request.headers)

  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')

  const dateNumber = Number(date)
  if (!preview && (isNaN(dateNumber) || dateNumber < 1 || dateNumber > 24)) {
    return redirect(`/`, { status: 301 })
  }

  if (!preview && today < targetDate) {
    throw new Response('Date not yet available', {
      status: 425,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  try {
    const { data: posts } = await loadQuery<POSTS_BY_YEAR_AND_DATEResult>(POSTS_BY_YEAR_AND_DATE, {
      date: formatDate,
    })

    const articleAmount = isNumericString(amountParam) ? Math.max(1, Number(amountParam)) : undefined
    const articlePage = isNumericString(pageParam) ? Math.max(0, Number(pageParam)) : 0
    const rotationIntervalMs = isNumericString(rotationIntervalParam)
      ? Math.max(5000, Number(rotationIntervalParam) * 1000)
      : ROTATION_INTERVAL_DEFAULT * 1000

    return {
      posts,
      year,
      date,
      articleAmount,
      articlePage,
      rotationIntervalMs,
    }
  } catch (error) {
    console.error('Error loading posts:', error)
    throw new Response('Error loading posts', { status: 500 })
  }
}

export const headers = combinedHeaders

export default function ScreenPreviewRoute() {
  const { posts, year, date, articleAmount, articlePage, rotationIntervalMs } = useLoaderData<typeof loader>()
  const { visiblePosts, currentPage } = useScreenPagination(posts, articleAmount, articlePage, rotationIntervalMs)

  return (
    <>
      <div className="landscape:hidden">{PortraitView(visiblePosts, year, date, currentPage)}</div>
      <div className="hidden landscape:block">{LandscapeView(visiblePosts, year, date, currentPage)}</div>
    </>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 425:
        return (
          <ErrorPage
            title="Nå var du for raskt ute!"
            description="Denne datoen er ikke tilgjengelig enda. Følg Bekk-stjernen tilbake til julekalenderen."
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
