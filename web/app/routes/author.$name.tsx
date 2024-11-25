import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { AUTHOR_WITH_POSTS_QUERY } from 'utils/sanity/queries/postQueries'
import { Author, Post } from 'utils/sanity/types/sanity.types'

import { loadQuery } from '../../utils/sanity/store'

import { LetterDisplayer } from '~/features/letters/LetterDisplayer'

export type AuthorWithPosts = {
  posts: Post[]
  author: Author
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { name } = params
  if (!name) {
    throw new Response('Missing author', { status: 404 })
  }

  const data = await loadQuery<AuthorWithPosts>(AUTHOR_WITH_POSTS_QUERY, { slug: name })

  return json(data)
}

export default function AuthorPage() {
  const { data } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
      <h1 className="font-delicious pb-4 md:pb-8 md:text-center">{data.author.fullName}</h1>
      <LetterDisplayer posts={data.posts} error={`Ingen innlegg funnet for ${data.author.fullName}`} />
    </div>
  )
}
