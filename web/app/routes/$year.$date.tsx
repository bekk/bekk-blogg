import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { POSTS_BY_YEAR_AND_DATE } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post } from '../../utils/sanity/types/sanity.types'

import { Letter } from '~/features/door/Letter'

type PostsByDate = {
  posts: Post[]
  year: string
  date: string
}

export async function loader({ params }: { params: { year: string; date: string } }) {
  const formatDate = params.year + '-' + '12' + '-' + params.date
  try {
    const { data: posts } = await loadQuery<Post[]>(POSTS_BY_YEAR_AND_DATE, { date: formatDate })
    if (!posts || posts.length === 0) {
      // Validate if post exists
      throw new Response('No post found for this date', { status: 404 })
    }

    return json<PostsByDate>({
      posts,
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
    <div className="flex flex-col items-center gap-8 pt-8 md:gap-12 md:pt-12">
      <h1 className="font-delicious text-reindeer-brown">{data.date}. desember</h1>
      <div className="flex flex-col items-center gap-8 md:gap-12">
        {data.posts.map((post) => (
          <Letter key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
