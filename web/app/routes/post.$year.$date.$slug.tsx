import { useLoaderData } from '@remix-run/react'
import { useQuery } from '@sanity/react-loader'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { z } from 'zod'

import { POST_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { POST_BY_SLUGResult } from '../../utils/sanity/types/sanity.types'
import { toPlainText, urlFor } from '../../utils/sanity/utils'

import '../portable-text/prism-theme.css'

import { Article } from '~/features/article/Article'

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
    throw new Response('Invalid params', { status: 400 })
  }
  const { year, date, slug } = parsedParams.data

  const { options, preview } = await loadQueryOptions(request.headers)

  const initial = await loadQuery<POST_BY_SLUGResult>(POST_BY_SLUG, { slug }, options)

  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')
  const currentDate = new Date(new Date().getTime() + 1000 * 60 * 60)
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

  const imageUrl = initial.data.coverImage?.asset
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
