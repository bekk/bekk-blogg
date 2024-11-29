import { HeadersFunction, json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { cleanControlCharacters } from 'utils/controlCharacters'
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

  if (!response.data.author) {
    throw new Response('Author not found', { status: 404 })
  }

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const authorName = cleanControlCharacters(data?.author?.fullName)
  const title = `Innhold fra ${authorName} | Bekk Christmas`
  const description = `Utforsk ${data?.pagination.totalPosts} innlegg fra ${authorName} på Bekk Christmas`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'og:image', content: '/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: '/og-image.png' },
  ]
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=3600',
})

export default function AuthorPage() {
  const { author, posts, pagination } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  if (!author) {
    return (
      <div className="flex flex-col items-center lg:mb-12">
        <h1 className="md:text-center mb-0">Fant ikke den forfatteren</h1>
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center lg:mb-12">
        <h1 className="md:text-center mb-0">Fant ingen innlegg av {author.fullName}</h1>
      </div>
    )
  }

  return (
    <>
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center lg:mb-12 md:gap-8">
          <h1 className="text-center md:text-center text-postcard-beige mb-4">Innhold fra {author?.fullName}</h1>
          <div className="flex flex-col mb-4 text-center text-postcard-beige gap-4">
            <p>Totalt {pagination.totalPosts} innlegg</p>
            {pagination.totalPages > 1 && (
              <p className="text-sm">
                Side {pagination.currentPage} av {pagination.totalPages}
              </p>
            )}
          </div>
          <PostPreviewList posts={posts} />
          <Pagination {...pagination} baseUrl={`/forfatter/${author.slug?.current}`} />
        </div>
      )}
    </>
  )
}
