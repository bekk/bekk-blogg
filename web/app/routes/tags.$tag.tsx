import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'

import { POSTS_BY_TAGS, TAG_BY_SLUG } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { Post, Tag } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'
import { LetterDisplayer } from '~/features/letters/LetterDisplayer'

export async function loader({ params }: LoaderFunctionArgs) {
  const { tag } = params
  if (!tag) {
    throw new Response('Missing tag', { status: 404 })
  }

  // Fetch posts and tag data in parallel
  const [postsData, tagData] = await Promise.all([
    loadQuery<Post[]>(POSTS_BY_TAGS, { t: tag }),
    loadQuery<Tag>(TAG_BY_SLUG, { slug: tag }),
  ])

  return json({ posts: postsData.data, tag: tagData.data })
}

export default function Posts() {
  const { posts, tag } = useLoaderData<typeof loader>()
  const state = useNavigation()

  return (
    <>
      {state.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center lg:mb-12">
          <h1 className="font-delicious md:text-center">{tag.name}</h1>
          <LetterDisplayer posts={posts} error={`Ingen innlegg funnet for ${tag.name}`} />
        </div>
      )}
    </>
  )
}
