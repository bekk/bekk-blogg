import { HeadersFunction, json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'

import { TAG_WITH_POSTS_QUERY } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { TAG_WITH_POSTS_QUERYResult } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'
import { Pagination } from '~/features/pagination/Pagination'
import { PostPreviewList } from '~/features/post-preview/PostPreview'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { tag } = params
  if (!tag) {
    throw new Response('Missing tag', { status: 404 })
  }

  // Get page from URL search params
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const perPage = 15
  const offset = (page - 1) * perPage

  const response = await loadQuery<TAG_WITH_POSTS_QUERYResult>(TAG_WITH_POSTS_QUERY, {
    t: tag,
    start: offset,
    end: offset + perPage,
  })

  return json({
    posts: response.data.posts || [],
    tag: response.data.tag,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((response.data.totalCount || 0) / perPage),
      totalPosts: response.data.totalCount || 0,
    },
  })
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=3600',
})

export default function Tags() {
  const { posts, tag, pagination } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  if (!tag) {
    return (
      <div className="flex flex-col items-center lg:mb-12">
        <h1 className="font-delicious md:text-center mb-0">Fant ikke den kategorien</h1>
      </div>
    )
  }

  return (
    <>
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center lg:mb-12">
          <h1 className="font-delicious text-center mb-0">Innhold om {tag?.name}</h1>
          <div className="mb-4 text-center">
            <p>Totalt {pagination.totalPosts} innlegg</p>
            {pagination.totalPages > 1 && (
              <p className="text-sm">
                Side {pagination.currentPage} av {pagination.totalPages}
              </p>
            )}
          </div>
          <PostPreviewList posts={posts} />
          <Pagination {...pagination} baseUrl={`/tags/${tag.slug}`} />
        </div>
      )}
    </>
  )
}
