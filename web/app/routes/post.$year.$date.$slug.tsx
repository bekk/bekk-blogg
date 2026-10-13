import {
  ActionFunctionArgs,
  data,
  isRouteErrorResponse,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useLoaderData,
  useNavigation,
  useRouteError,
} from 'react-router'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { combinedHeaders } from 'utils/headers'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { writeClient } from 'utils/sanity/sanity.server'
import { z } from 'zod'

import { loadQuery } from 'utils/sanity/loader.server'
import { POST_BY_SLUG } from 'utils/sanity/queries/postQueries'
import { POST_BY_SLUG_RESULT } from 'utils/sanity/types/sanity.types'
import { toPlainText, urlFor } from 'utils/sanity/utils'
import { ErrorPage } from '../features/error-boundary/ErrorPage'

import '../portable-text/prism-theme.css'

import { getDoorDate, getOsloDate, isDoorOpen, parseIsoDate } from 'utils/calendar'
import { useQuery } from 'utils/sanity/loader'
import { Spinner } from '~/components/Spinner'
import { Article } from '~/features/article/Article'
import { RelatedPosts } from '~/features/article/RelatedPosts'
import Series, { shouldShowSeries } from '~/features/article/Series'
import { ArticleHeader } from '~/features/article/ArticleHeader'

export const meta: MetaFunction<typeof loader> = ({ loaderData: data }) => {
  const post = data?.initial.data

  if (!post) {
    return []
  }

  const { year, day } = parseIsoDate(post.availableFrom ?? '')
  const postUrl = `https://www.bekk.christmas/post/${year}/${String(day).padStart(2, '0')}/${post.slug?.current}`
  // Peker på originalen hvis innlegget er publisert et annet sted først
  const canonicalUrl = post.canonicalUrl ?? postUrl
  const title = cleanControlCharacters(post.title ?? 'Innlegg')
  const description = cleanControlCharacters(post.previewText ?? toPlainText(post.description))
  const authors = cleanControlCharacters(
    post.authors?.map((author: { fullName: string }) => author.fullName).join(', ')
  )

  const meta = [
    { title: `${title} | Bekk Christmas` },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'article:published_time', content: post.availableFrom },
    { property: 'article:modified_time', content: post._updatedAt },
    { property: 'article:author', content: authors },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    {
      tagName: 'link',
      rel: 'canonical',
      href: canonicalUrl,
    },
  ]

  if (post.coverImage?.asset) {
    meta.push({ property: 'og:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
    meta.push({ name: 'twitter:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
  } else {
    meta.push({ property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' })
    meta.push({ name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' })
  }

  if (post.availableFrom) {
    meta.push({ property: 'og:url', content: postUrl })
  }

  return meta
}

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
  date: z.string().min(1).max(2),
  slug: z.string().min(1),
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
  const { year, date, slug } = parsedParams.data

  if (date.length === 1) {
    return redirect(`/post/${year}/${date.padStart(2, '0')}/${encodeURIComponent(slug)}`, { status: 301 })
  }

  // Parametrene er allerede dekodet av React Router
  const decodedSlug = slug

  const { options, preview } = await loadQueryOptions(request.headers)
  const queryParams = { slug: decodedSlug, today: getOsloDate() }
  const initial = await loadQuery<POST_BY_SLUG_RESULT>(POST_BY_SLUG, queryParams, options)

  const yearNumber = Number(year)
  const dateNumber = Number(date)

  if (!preview && (isNaN(dateNumber) || isNaN(yearNumber) || dateNumber < 1 || dateNumber > 24)) {
    throw new Response('Date not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  if (!preview && !isDoorOpen(year, date, getOsloDate())) {
    throw new Response('Date not yet available', {
      status: 425,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  if (!initial.data) {
    throw new Response('Post not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }
  if (!preview && initial.data.availableFrom !== getDoorDate(year, date)) {
    throw new Response('Post date and date in url do not match', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  const imageUrl = initial.data.coverImage?.asset
    ? urlFor(initial.data.coverImage).width(1200).format('webp').url()
    : undefined

  return data(
    {
      initial,
      query: POST_BY_SLUG,
      params: queryParams,
      imageUrl,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': preview
          ? 'no-cache, no-store'
          : 'public, max-age=10, stale-while-revalidate=2592000, stale-if-error=2592000',
      },
    }
  )
}

const ActionSchema = z.object({
  id: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const unparsed = await request.formData()
  const formData = ActionSchema.safeParse({ id: unparsed.get('id') })
  if (!formData.success) {
    console.error(formData.error)
    return { status: 'error', error: 'Skjemaet inneholdt ugyldige data' } as const
  }

  const { id } = formData.data

  try {
    // Kun publiserte poster som har åpnet kan få poeng – ikke utkast eller andre dokumenter
    const post = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "post" && _id == $id && availableFrom <= $today][0]{ _id }`,
      { id, today: getOsloDate() },
      { perspective: 'published' }
    )
    if (!post) {
      return { status: 'error', error: 'Fant ikke innlegget' } as const
    }
    // `inc` er atomisk, så samtidige likes overskriver ikke hverandre
    const { points } = await writeClient
      .patch(post._id)
      .setIfMissing({ points: 0 })
      .inc({ points: 1 })
      .commit<{ points: number }>()
    console.info('Registered a point for post', id, 'now totalling', points)
    return { status: 'success', points } as const
  } catch {
    console.error('Something went wrong while increasing points for post ', id)
    return { status: 'error', error: 'Det skjedde en feil. Prøv igjen senere.' } as const
  }
}

export const headers = combinedHeaders

export default function ArticleRoute() {
  const loaderData = useLoaderData<typeof loader>()
  const { initial, query, params } = loaderData
  const { data } = useQuery<typeof initial.data>(query, params, {
    initial,
  })
  const { state } = useNavigation()
  const isNavigating = state === 'loading'

  if (!data) {
    return null
  }

  return (
    <div className="wrap-break-word min-h-screen pb-20">
      {isNavigating ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="md:p-8">
            <div className="striped-frame mx-auto max-w-(--breakpoint-2xl)">
              <ArticleHeader />
              <Article post={data} />
            </div>
          </div>
          <div className="w-full flex justify-center">
            {shouldShowSeries(data) && data.series && <Series postId={data._id} series={data.series} mobileOnly />}
          </div>
          <RelatedPosts objectID={data._id} />
        </>
      )}
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (!isRouteErrorResponse(error)) {
    return (
      <ErrorPage
        title="Uventet feil"
        description="Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen."
      />
    )
  }

  switch (error.status) {
    case 404:
      return (
        <ErrorPage
          title="Dette innholdet finnes ikke. Det kan hende lenken er feil, eller at lenken har endret  seg."
          description="Følg Bekk-stjernen for å komme tilbake til julekalenderen"
        />
      )
    case 425:
      return (
        <ErrorPage
          title="Dette innholdet er ikke tilgjengelig enda. Vær tålmodig og sjekk tilbake om litt!"
          description="Følg Bekk-stjernen for å komme tilbake til julekalenderen"
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
