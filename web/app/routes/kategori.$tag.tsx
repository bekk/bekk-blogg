import { isRouteErrorResponse, useLoaderData, useNavigation, useRouteError } from '@remix-run/react'
import { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { combinedHeaders } from 'utils/headers'

import { TAG_WITH_POSTS_QUERY } from '../../utils/sanity/queries/postQueries'
import { loadQuery } from '../../utils/sanity/store'
import { TAG_WITH_POSTS_QUERYResult } from '../../utils/sanity/types/sanity.types'

import { Spinner } from '~/components/Spinner'
import { ErrorPage } from '~/features/error-boundary/ErrorPage'
import Header from '~/features/header/Header'
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

  if (!response.data || !response.data.tag) {
    throw new Response('No category with this name', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  return {
    posts: response.data.posts || [],
    tag: response.data.tag,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((response.data.totalCount || 0) / perPage),
      totalPosts: response.data.totalCount || 0,
    },
    algolia: {
      app: process.env.ALGOLIA_APP_ID!,
      key: process.env.ALGOLIA_SEARCH_KEY!,
      index: process.env.ALGOLIA_INDEX!,
    },
  }
}

export const headers = combinedHeaders

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const description = `Utforsk ${data?.pagination.totalPosts} innlegg om ${data?.tag?.name} på Bekk Christmas`
  const title = `Innhold om ${data?.tag?.name} | Bekk Christmas`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export default function TagRoute() {
  const { posts, tag, pagination, algolia } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <div className="bg-wooden-table-with-cloth">
      <header className="relative">
        <Header algolia={algolia} />
      </header>
      {!tag && (
        <div className="flex flex-col items-center lg:mb-12">
          <h1 className="md:text-center mb-0">Fant ikke den kategorien</h1>
        </div>
      )}
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center md:gap-8 pb-12">
          <h1 className="text-center md:text-center text-postcard-beige mb-4">Innhold om {tag?.name}</h1>
          <div className="flex flex-col mb-4 text-center text-postcard-beige gap-4">
            <p>Totalt {pagination.totalPosts} innlegg</p>
            {pagination.totalPages > 1 && (
              <p className="text-sm">
                Side {pagination.currentPage} av {pagination.totalPages}
              </p>
            )}
          </div>
          <PostPreviewList posts={posts} />
          <Pagination {...pagination} baseUrl={`/kategori/${tag.slug}`} />
        </div>
      )}
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorPage
        title="Fant ikke den kategorien"
        description="Det kan hende kategorien du leter etter ikke finnes lenger, eller at du skrev inn feil URL."
      />
    )
  }
  return (
    <ErrorPage
      title="Uventet feil"
      description="Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen."
    />
  )
}
