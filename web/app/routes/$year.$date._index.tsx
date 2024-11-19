import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'

import { POSTS_BY_YEAR_AND_DATE } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { Letter } from '~/features/door/Letter'

type PostsByDate = {
  posts: Post[]
  year: string
  date: string
}

export const meta: MetaFunction = ({ data }) => {
  const postsByDate = data as PostsByDate
  const title = `Innlegg fra ${postsByDate.date}. desember ${postsByDate.year}`
  const description = `Se ${
    postsByDate.posts.length > 1 ? `alle ${postsByDate.posts.length} innlegg` : `innholdet`
  } fra Bekk på dag ${postsByDate.date} i julesesongen ${postsByDate.year}`

  return [
    { title },
    { name: 'description', content: description },
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]
}

export const headers = () => ({
  'Cache-Control': 'max-age=60, stale-while-revalidate=86400',
})

const ParamsSchema = z.object({
  year: z.string().min(4).max(4),
  date: z.string().min(2).max(2),
})

export async function loader({ params, request }: LoaderFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    throw new Response('Invalid params', { status: 400 })
  }
  const { year, date } = parsedParams.data

  const isPreview = new URLSearchParams(request.url).get('preview') === 'true'
  const formatDate = year + '-' + '12' + '-' + date
  const currentDate = new Date()

  const targetDate = new Date(formatDate)
  if (!isPreview && currentDate < targetDate) {
    throw new Response('Date not yet available', { status: 425 })
  }

  try {
    const { data: posts } = await loadQuery<Post[]>(POSTS_BY_YEAR_AND_DATE, { date: formatDate })

    return json<PostsByDate>({
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
  const data = useLoaderData<PostsByDate>()

  return (
    <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
      <h1 className="self-start pl-4 font-delicious text-reindeer-brown md:self-center">{data.date}. desember</h1>
      <div className="flex flex-col gap-8 md:gap-12">
        {data.posts.length === 0 && <h2>I denne luka var det helt tomt, gitt!</h2>}
        {data.posts.map((post) => (
          <Link
            className="mx-4 flex justify-center"
            to={`/${data.year}/${data.date}/${post.slug?.current}`}
            key={post._id}
          >
            <Letter key={post._id} post={post} />
          </Link>
        ))}
      </div>
    </div>
  )
}
