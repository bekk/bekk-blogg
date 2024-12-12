import { InstantSearch, RelatedProducts } from 'react-instantsearch'
import { isRouteErrorResponse, json, Link, redirect, useLoaderData, useRouteError } from '@remix-run/react'
import { useQuery } from '@sanity/react-loader'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import algoliasearch from 'algoliasearch/lite'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { combinedHeaders } from 'utils/headers'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { writeClient } from 'utils/sanity/sanity.server'
import { z } from 'zod'

import { parseDate } from '../../utils/date'
import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { POST_BY_SLUGResult } from '../../utils/sanity/types/sanity.types'
import { toPlainText, urlFor } from '../../utils/sanity/utils'
import { ErrorPage } from '../features/error-boundary/ErrorPage'

import '../portable-text/prism-theme.css'

import { DoorSign } from '~/components/DoorSign'
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
          : 'public, max-age=60, s-maxage=60, stale-while-revalidate=2592000, stale-if-error=2592000',
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
    const { points } = await writeClient
      .patch(id)
      .setIfMissing({ points: 0 })
      .inc({ points: 1 })
      .commit<{ points: number }>()
    console.info(`Registered a point for post ${id}, now totalling ${points} points`)
    return { status: 'success', points } as const
  } catch {
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

  if (!data) {
    return null
  }

  const searchClient = algoliasearch(algolia.appId, algolia.apiKey)

  return (
    <div className="bg-wooden-table break-words md:p-8 min-h-screen">
      <div className="striped-frame mx-auto max-w-screen-2xl">
        <header className="relative">
          <Header />
        </header>
        <Article post={data} />
      </div>
      <div>
        <InstantSearch searchClient={searchClient} indexName="christmas_dev">
          <RelatedProducts
            headerComponent={() => (
              <div className="inset-0 flex">
                <DoorSign link="">Relaterte artikler</DoorSign>
              </div>
            )}
            objectIDs={[data._id]}
            limit={3}
            layoutComponent={(props) => (
              <RelatedPostsLayout
                // eslint-disable-next-line react/prop-types
                items={props.items.map(
                  (item) =>
                    ({
                      objectID: item.objectID,
                      name: item.title,
                      image: item.image,
                      author: item.authors,
                      tags: item.tags || [],
                      slug: item.slug.current,
                      availableFrom: item.availableFrom,
                    }) as RelatedPostsData
                )}
              />
            )}
            emptyComponent={() => <p className="text-black">No recomendations.</p>}
          />
        </InstantSearch>
      </div>
    </div>
  )
}

interface RelatedPostsData {
  objectID: string
  name: string
  author: string[]
  tags: string[]
  slug?: string
  availableFrom?: string
}

const RelatedPostsLayout = ({ items }: { items: RelatedPostsData[] }) => {
  console.log(items)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4 pb-10">
      {items.map((item) => {
        const date = parseDate(item.availableFrom ?? '')
        return (
          <div key={item.objectID} className="border p-4 rounded-lg shadow-md bg-postcard-beige">
            <Link to={`/post/${date.year}/${date.day}/${item.slug}`}>
              <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
              <p className="text-sm">{item.author}</p>
              <p className="text-sm text-gray-500">
                {date.day}. desember, {date.year}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        )
      })}
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
