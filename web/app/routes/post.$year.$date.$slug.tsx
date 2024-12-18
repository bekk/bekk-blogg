import { isRouteErrorResponse, json, redirect, useLoaderData, useRouteError } from '@remix-run/react'
import { useQuery } from '@sanity/react-loader'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, RelatedProducts } from 'react-instantsearch'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { combinedHeaders } from 'utils/headers'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { writeClient } from 'utils/sanity/sanity.server'
import { z } from 'zod'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post, POST_BY_SLUGResult } from '../../utils/sanity/types/sanity.types'
import { toPlainText, urlFor } from '../../utils/sanity/utils'
import { ErrorPage } from '../features/error-boundary/ErrorPage'

import '../portable-text/prism-theme.css'

import { useRef } from 'react'
import { DoorSign } from '~/components/DoorSign'
import { Article } from '~/features/article/Article'
import { RelatedPostsLayout } from '~/features/article/RelatedPostLayout'
import Series, { shouldShowSeries } from '~/features/article/Series'
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
      content: `https://bekk.christmas/post/${availableFrom.getFullYear()}/${availableFrom.getDate().toString().padStart(2, '0')}/${post.slug?.current}`,
    })
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
    {
      initial,
      query: POST_BY_SLUG,
      params: parsedParams.data,
      imageUrl,
      algolia: {
        appId: process.env.ALGOLIA_APP_ID!,
        apiKey: process.env.ALGOLIA_SEARCH_KEY!,
        index: process.env.ALGOLIA_INDEX!,
      },
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
    const doc = await writeClient.getDocument<Post>(id)
    const initialPoints = doc?.points ?? 0
    const { points } = await writeClient
      .patch(id)
      .set({ points: initialPoints + 1 })
      .commit<{ points: number }>()
    console.info(`Registered a point for post ${id}, now totalling ${points} points`)
    return { status: 'success', points } as const
  } catch {
    console.error('Something went wrong while increasing points for post ', id)
    return { status: 'error', error: 'Det skjedde en feil. Prøv igjen senere.' } as const
  }
}

export const headers = combinedHeaders

export default function ArticleRoute() {
  const { initial, query, params, algolia } = useLoaderData<typeof loader>()
  const { data } = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error Dette er en kjent bug i sanity-react-loader
    initial,
  })
  const searchClient = useRef(algoliasearch(algolia.appId, algolia.apiKey))

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
      {shouldShowSeries(data) && data.series && <Series postId={data._id} series={data.series} mobileOnly />}
      <div>
        <InstantSearch searchClient={searchClient.current} indexName={algolia.index}>
          <RelatedProducts
            headerComponent={() => (
              <div className="inset-0 flex m-6 justify-center ">
                <DoorSign>Relaterte artikler</DoorSign>
              </div>
            )}
            /*queryParameters={{ filters: `availableFromMillis <= ${Math.floor(Date.now() / 1000)}` }}*/
            objectIDs={[data._id]}
            limit={3}
            layoutComponent={({ items }) => {
              return (
                <RelatedPostsLayout
                  items={items
                    .filter((item) => !item._id.startsWith('drafts.'))
                    .map((item) => ({
                      objectID: item.objectID,
                      name: item.title,
                      image: item.image,
                      author: item.authors,
                      tags: item.tags || [],
                      slug: item.slug?.current,
                      availableFrom: item.availableFrom,
                    }))}
                />
              )
            }}
            emptyComponent={() => <p className="text-black">Ingen anbefalinger</p>}
          />
        </InstantSearch>
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
