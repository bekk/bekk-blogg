import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useQuery } from '@sanity/react-loader'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { urlFor } from 'utils/sanity/sanity.server'
import { z } from 'zod'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { Article } from '~/features/article/Article'

export const meta: MetaFunction = ({ data }) => {
  const post = data as Post & { imageUrl?: string }
  const availableFrom = post?.availableFrom ? new Date(post.availableFrom) : undefined

  const meta = [
    { title: post?.title || 'Innlegg' },
    { name: 'description', content: post?.description },
    { property: 'og:title', content: post?.title || 'Innlegg' },
    { property: 'og:description', content: post?.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'article:published_time', content: post?.availableFrom },
    { property: 'article:modified_time', content: post?._updatedAt },
    { property: 'article:author', content: post?.authors?.map((author) => author.fullName).join(', ') },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post?.title || 'Innlegg' },
    { name: 'twitter:description', content: post?.description },
    { name: 'twitter:site', content: '@livetibekk' },
  ]

  if (post?.imageUrl) {
    meta.push({ property: 'og:image', content: post.imageUrl })
    meta.push({ name: 'twitter:image', content: post.imageUrl })
  }

  if (availableFrom) {
    meta.push({
      property: 'og:url',
      content: `https://bekk.christmas/${availableFrom.getFullYear()}/${availableFrom.getDate().toString().padStart(2, '0')}/${post.slug}`,
    })
  }

  if (post.tags && post.tags.length > 0) {
    meta.push({ property: 'article:tag', content: post.tags.join(', ') })
  }

  return meta
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'max-age=60, stale-while-revalidate=86400',
})

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
  date: z.string().min(1).max(2),
  slug: z.string().min(1),
})

export async function loader({ params, request }: LoaderFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', { status: 400 })
  }
  const { year, date, slug } = parsedParams.data

  const { options, preview } = await loadQueryOptions(request.headers)

  const initial = await loadQuery<Post>(POST_BY_SLUG, { slug }, options)

  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')
  const currentDate = new Date()
  const targetDate = new Date(formatDate)
  const dateNumber = parseInt(date, 10)

  if (!preview && (isNaN(dateNumber) || dateNumber < 1 || dateNumber > 24)) {
    throw new Response('Date not found', { status: 404 })
  }

  if (!preview && currentDate < targetDate) {
    throw new Response('Date not yet available', { status: 425 })
  }
  if (!initial.data) {
    throw new Response('Post not found', { status: 404 })
  }
  if (!preview && initial.data.availableFrom !== formatDate) {
    throw new Response('Post date and date in url do not match', { status: 404 })
  }

  const imageUrl = initial.data.coverImage
    ? urlFor(initial.data.coverImage).width(1200).format('webp').url()
    : undefined

  return { initial, query: POST_BY_SLUG, params: parsedParams.data, imageUrl }
}

export default function Index() {
  const { initial, query, params } = useLoaderData<typeof loader>()
  const { data } = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error There's a TS issue with how initial comes over the wire
    initial,
  })

  if (!data) {
    return null
  }

  return <Article post={data} />
}
