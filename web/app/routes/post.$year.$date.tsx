import { isRouteErrorResponse, redirect, useLoaderData, useRouteError } from '@remix-run/react'
import { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { combinedHeaders } from 'utils/headers'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'
import { z } from 'zod'

import { POSTS_BY_YEAR_AND_DATE } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'

import { DayNavigation } from '~/features/article/DayNavigation'
import { ErrorPage } from '~/features/error-boundary/ErrorPage'
import Header from '~/features/header/Header'
import { PostPreviewList } from '~/features/post-preview/PostPreview'

export const meta: MetaFunction<typeof loader> = ({ data: postsByDate }) => {
  if (!postsByDate) {
    return []
  }
  const title = `Innlegg fra ${Number(postsByDate.date)}. desember ${postsByDate.year}`
  const description = `Se ${
    postsByDate.posts.length > 1 ? `${postsByDate.posts.length} innlegg` : `innholdet`
  } fra Bekk på dag ${Number(postsByDate.date)} i julesesongen ${postsByDate.year}`

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

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
  date: z.string().min(1).max(2),
})

export async function loader({ params, request }: LoaderFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', {
      status: 400,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  const { year, date } = parsedParams.data

  if (date.length === 1) {
    return redirect(`/post/${year}/${date.padStart(2, '0')}`)
  }

  const { preview } = await loadQueryOptions(request.headers)
  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')
  const currentDate = new Date(new Date().getTime() + 1000 * 60 * 60)

  const dateNumber = Number(date)
  if (!preview && (isNaN(dateNumber) || dateNumber < 1 || dateNumber > 24)) {
    throw new Response('Date not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  const targetDate = new Date(formatDate)
  if (!preview && currentDate < targetDate) {
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

    return {
      posts: posts ?? [],
      year,
      date,
    }
  } catch (error) {
    console.error('Error loading posts:', error)
    throw new Response('Error loading posts', { status: 500 })
  }
}

export const headers = combinedHeaders

export default function DateRoute() {
  const { date, year, posts } = useLoaderData<typeof loader>()

  return (
    <div className="bg-wooden-table-with-cloth min-h-screen">
      <header className="relative">
        <Header />
      </header>
      <div className="flex flex-col">
        <h1 className="mb-4 sm:mb-12 self-start pl-4 md:pl-0 text-4xl md:text-5xl text-postcard-beige sm:self-center">
          {parseInt(date) < 10 ? date.replace('0', '') : date}. desember
        </h1>
        <p className="self-start sm:self-center pl-4 mb-8 sm:mb-12 text-white ">Totalt {posts.length} innlegg</p>
        <PostPreviewList posts={posts} />
        <DayNavigation day={Number(date)} year={Number(year)} />
      </div>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 400:
      case 404:
        return (
          <ErrorPage
            title="Her var det noe feil med datoen"
            description="Denne datoen finnes ikke. Følg Bekk-stjernen tilbake til julekalenderen."
          />
        )
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
