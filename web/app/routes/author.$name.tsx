import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { AUTHOR_BY_SLUG, POSTS_BY_AUTHOR } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Author, Post } from '../../utils/sanity/types/sanity.types'

import { LetterDisplayer } from '~/features/letters/LetterDisplayer'

export async function loader({ params }: LoaderFunctionArgs) {
  const { name } = params
  if (!name) {
    throw new Response('Missing author', { status: 404 })
  }

  // Fetch posts and author data in parallel
  const [postsData, authorData] = await Promise.all([
    loadQuery<Post[]>(POSTS_BY_AUTHOR, { slug: name }),
    loadQuery<Author>(AUTHOR_BY_SLUG, { slug: name }),
  ])

  return json({ posts: postsData.data, author: authorData.data })
}

export default function AuthorPage() {
  const { posts, author } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
      <h1 className="font-delicious pb-4 md:pb-8 md:text-center">{author.fullName}</h1>
      <LetterDisplayer posts={posts} error={`Ingen innlegg funnet for ${author.fullName}`} />
    </div>
  )
}
