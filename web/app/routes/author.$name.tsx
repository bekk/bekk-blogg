import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { AUTHOR_WITH_POSTS_QUERY } from 'utils/sanity/queries/postQueries'
import { AUTHOR_WITH_POSTS_QUERYResult } from 'utils/sanity/types/sanity.types'

import { loadQuery } from '../../utils/sanity/store'

import { Spinner } from '~/components/Spinner'
import { Pagination } from '~/features/pagination/Pagination'
import { PostPreviewList } from '~/features/post-preview/PostPreview'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { name } = params
  if (!name) {
    throw new Response('Missing author', { status: 404 })
  }

  // Get page from URL search params
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const perPage = 15
  const offset = (page - 1) * perPage

  const response = await loadQuery<AUTHOR_WITH_POSTS_QUERYResult>(AUTHOR_WITH_POSTS_QUERY, {
    slug: name,
    start: offset,
    end: offset + perPage,
  })

  return json({
    posts: response.data.posts || [],
    author: response.data.author,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((response.data.totalCount || 0) / perPage),
      totalPosts: response.data.totalCount || 0,
    },
  })
}

export default function AuthorPage() {
  const { author, posts, pagination } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  if (!author) {
    return (
      <div className="flex flex-col items-center lg:mb-12">
        <h1 className="font-delicious md:text-center mb-0">Fant ikke den forfatteren</h1>
      </div>
    )
  }

  return (
    <>
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center gap-8 mb-4 lg:mb-12 md:gap-12">
          <h1 className="font-delicious md:text-center mb-0">Innhold fra {author?.fullName}</h1>
          <div className="mb-4 text-center">
            <p>Totalt {pagination.totalPosts} innlegg</p>
            {pagination.totalPages > 1 && (
              <p className="text-sm">
                Side {pagination.currentPage} av {pagination.totalPages}
              </p>
            )}
          </div>
          <PostPreviewList posts={posts} />
          <Pagination {...pagination} baseUrl={`/author/${author.slug?.current}`} />
        </div>
      )}
    </>
  )
}
