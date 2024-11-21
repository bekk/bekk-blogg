import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { z } from 'zod'

import { POSTS_BY_YEAR_AND_DATE } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { LetterDisplayer } from '~/features/letters/LetterDisplayer'

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

  const { preview } = await loadQueryOptions(request.headers)
  const formatDate = year + '-' + '12' + '-' + date
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
  let date = data.date
  if (parseInt(data.date) < 10) {
    date = data.date.replace('0', '')
  }

  return (
    <div className="flex flex-col">
      <h1 className="self-start pl-4 md:pl-0 pb-4 md:pb-10 font-delicious text-4xl md:text-5xl text-reindeer-brown sm:self-center">
        {date}. desember
      </h1>
      <LetterDisplayer posts={data.posts} error={'I denne luka var det helt tomt, gitt!'} />
    </div>
  )
}
