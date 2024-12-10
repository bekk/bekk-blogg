import { isRouteErrorResponse, json, redirect, useLoaderData, useRouteError } from '@remix-run/react'
import { useQuery } from '@sanity/react-loader'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { combinedHeaders } from 'utils/headers'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { z } from 'zod'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { POST_BY_SLUGResult } from '../../utils/sanity/types/sanity.types'
import { toPlainText, urlFor } from '../../utils/sanity/utils'
import { ErrorPage } from '../features/error-boundary/ErrorPage'

import '../portable-text/prism-theme.css'

import { Article } from '~/features/article/Article'
import Header from '~/features/header/Header'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const post = data?.initial.data

  if (!post) {
    return []
  }

  const availableFrom = post.availableFrom ? new Date(post.availableFrom) : undefined
  const title = cleanControlCharacters(post.title ?? 'Innlegg')
  const description = cleanControlCharacters(post.previewText ?? toPlainText(post.description))
  const authors = cleanControlCharacters(post.authors?.map((author) => author.fullName).join(', '))

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
  ]

  if (post.coverImage?.asset) {
    meta.push({ property: 'og:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
    meta.push({ name: 'twitter:image', content: urlFor(post.coverImage).width(1200).format('webp').url() })
  } else {
    meta.push({ property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' })
    meta.push({ name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' })
  }

  if (availableFrom) {
    meta.push({
      property: 'og:url',
      content: `https://bekk.christmas/post/${availableFrom.getFullYear()}/${availableFrom.getDate().toString().padStart(2, '0')}/${post.slug}`,
    })
  }

  if (post.tags && post.tags.length > 0) {
    meta.push({ property: 'article:tag', content: post.tags.join(', ') })
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
    return redirect(`/post/${year}/${date.padStart(2, '0')}/${slug}`, { status: 301 })
  }

  const { options, preview } = await loadQueryOptions(request.headers)

  const initial = await loadQuery<POST_BY_SLUGResult>(POST_BY_SLUG, { slug }, options)

  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')
  const currentDate = new Date(new Date().getTime() + 1000 * 60 * 60)
  const targetDate = new Date(formatDate)
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

  if (!preview && currentDate < targetDate) {
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
  if (!preview && initial.data.availableFrom !== formatDate) {
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

  return json(
    { initial, query: POST_BY_SLUG, params: parsedParams.data, imageUrl },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': preview
          ? 'no-cache, no-store'
          : 'public, max-age=60, s-maxage=60, stale-while-revalidate=2592000, stale-if-error=2592000',
      },
    }
  )
}

export const headers = combinedHeaders

export default function ArticleRoute() {
  const { initial, query, params } = useLoaderData<typeof loader>()
  const { data } = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error Dette er en kjent bug i sanity-react-loader
    initial,
  })

  if (!data) {
    return null
  }

  return (
    <div className="bg-wooden-table break-words md:p-8 min-h-screen">
      <div className="striped-frame mx-auto max-w-screen-2xl">
        <header className="relative">
          <Header />
        </header>
        <Article post={data} />
      </div>
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
