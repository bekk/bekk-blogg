import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'

import { TAG_WITH_POSTS_QUERY } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { TAG_WITH_POSTS_QUERYResult } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'
import { PostPreviewList } from '~/features/post-preview/PostPreview'

export async function loader({ params }: LoaderFunctionArgs) {
  const { tag } = params
  if (!tag) {
    throw new Response('Missing tag', { status: 404 })
  }

  const response = await loadQuery<TAG_WITH_POSTS_QUERYResult>(TAG_WITH_POSTS_QUERY, { t: tag })

  return json(response.data)
}

export default function Posts() {
  const { posts, tag } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <>
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center lg:mb-12">
          <h1 className="font-delicious md:text-center mb-0">Innhold om {tag?.name}</h1>
          <p className="mb-4">Totalt {posts?.length} innlegg</p>
          <PostPreviewList posts={posts} />
        </div>
      )}
    </>
  )
}
