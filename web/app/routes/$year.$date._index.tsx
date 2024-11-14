import { json, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

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

export async function loader({ params }: { params: { year: string; date: string } }) {
  const formatDate = params.year + '-' + '12' + '-' + params.date
  try {
    const { data: posts } = await loadQuery<Post[]>(POSTS_BY_YEAR_AND_DATE, { date: formatDate })

    return json<PostsByDate>({
      posts: posts ?? [],
      year: params.year,
      date: params.date,
    })
  } catch (error) {
    console.error('Error loading posts:', error)
    throw new Response('Error loading posts', { status: 500 })
  }
}

export default function Index() {
  const data = useLoaderData<PostsByDate>()

  return (
    <div className="flex flex-col items-center gap-8 max-sm:mb-8 md:my-12 md:gap-12 md:pt-8">
      <h1 className="font-delicious text-reindeer-brown">{data.date}. desember</h1>
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
