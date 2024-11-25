import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { AUTHOR_WITH_POSTS_QUERY } from 'utils/sanity/queries/postQueries'
import { AUTHOR_WITH_POSTS_QUERYResult } from 'utils/sanity/types/sanity.types'

import { loadQuery } from '../../utils/sanity/store'

import { PostPreviewList } from '~/features/post-preview/PostPreview'

export async function loader({ params }: LoaderFunctionArgs) {
  const { name } = params
  if (!name) {
    throw new Response('Missing author', { status: 404 })
  }

  const response = await loadQuery<AUTHOR_WITH_POSTS_QUERYResult>(AUTHOR_WITH_POSTS_QUERY, { slug: name })

  return json(response.data)
}

export default function AuthorPage() {
  const { author, posts } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
      <h1 className="font-delicious md:text-center mb-0">Innhold fra {author?.fullName}</h1>
      <p className="mb-4">Totalt {posts?.length} innlegg</p>
      <PostPreviewList posts={posts} />
    </div>
  )
}
