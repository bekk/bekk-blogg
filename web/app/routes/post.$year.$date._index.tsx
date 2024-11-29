import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'
import { z } from 'zod'

import { POSTS_BY_YEAR_AND_DATE } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'

import { DayNavigation } from '~/features/article/DayNavigation'
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
    throw new Response('Invalid params', { status: 400 })
  }
  const { year, date } = parsedParams.data

  const { preview } = await loadQueryOptions(request.headers)
  const formatDate = year + '-' + '12' + '-' + date.padStart(2, '0')
  const currentDate = new Date()

  const dateNumber = parseInt(date, 10)
  if (!preview && (isNaN(dateNumber) || dateNumber < 1 || dateNumber > 24)) {
    throw new Response('Date not found', { status: 404 })
  }

  const targetDate = new Date(formatDate)
  if (!preview && currentDate < targetDate) {
    throw new Response('Date not yet available', { status: 425 })
  }

  try {
    const { data: posts } = await loadQuery<POSTS_BY_YEAR_AND_DATEResult>(POSTS_BY_YEAR_AND_DATE, { date: formatDate })

    return json({
      posts: posts ?? [],
      year,
      date,
    })
  } catch (error) {
    console.error('Error loading posts:', error)
    throw new Response('Error loading posts', { status: 500 })
  }
}

export default function Index() {
  const { date, year, posts } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col">
      <h1 className="self-start pl-4 md:pl-0 text-4xl md:text-5xl text-postcard-beige sm:self-center">
        {parseInt(date) < 10 ? date.replace('0', '') : date}. desember
      </h1>
      <PostPreviewList posts={posts} />
      <DayNavigation day={Number(date)} year={Number(year)} />
    </div>
  )
}
