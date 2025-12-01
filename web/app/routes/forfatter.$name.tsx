import {
  isRouteErrorResponse,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useNavigation,
  useRouteError,
} from 'react-router'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { combinedHeaders } from 'utils/headers'
import { AUTHOR_WITH_POSTS_QUERY } from 'utils/sanity/queries/postQueries'
import { Author, AUTHOR_WITH_POSTS_QUERYResult } from 'utils/sanity/types/sanity.types'

import { loadQuery } from 'utils/sanity/loader.server'

import { GithubIcon, GlobeIcon, InstagramIcon, LinkedinIcon, MailIcon, TwitterIcon } from 'lucide-react'
import { urlFor } from 'utils/sanity/utils'
import { Spinner } from '~/components/Spinner'
import { ErrorPage } from '~/features/error-boundary/ErrorPage'
import Header from '~/features/header/Header'
import { Pagination } from '~/features/pagination/Pagination'
import { PostPreviewList } from '~/features/post-preview/PostPreview'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { name } = params
  if (!name) {
    throw new Response('Missing name parameter', {
      status: 400,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
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
    throw new Response('Author not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    })
  }

  return {
    posts: response.data.posts || [],
    author: response.data.author,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((response.data.totalCount || 0) / perPage),
      totalPosts: response.data.totalCount || 0,
    },
  }
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
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export const headers = combinedHeaders

export default function AuthorRoute() {
  const { author, posts, pagination } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isSomethingWrong = !author || !posts || posts.length === 0
  return (
    <div className="bg-soft-pink pb-8 min-h-screen">
      <header className="relative">
        <Header withBreadcrumbs={false} />
      </header>
      {isSomethingWrong && (
        <div className="flex flex-col items-center xl:mb-12">
          <h1 className="md:text-center mb-0">
            {author ? `Fant ingen innlegg fra ${author.fullName}` : 'Fant ikke forfatteren'}
          </h1>
        </div>
      )}
      {navigation.state === 'loading' ? (
        <Spinner />
      ) : (
        <div className="flex xl:flex-row flex-col xl:gap-16 mt-10">
          <section className="flex xl:flex-[1] flex-col text-red-berry mb-12 xl:items-end xl:ml-8">
            <div>
              <div className="flex flex-col justify-center">
                {author?.image && (
                  <img
                    src={urlFor(author.image).width(700).height(800).url()}
                    alt={`Bilde av ${author.fullName}`}
                    className=" mb-4 w-[300px] h-[360px] md:w-[400px] md:h-[500px] object-cover mx-auto"
                  />
                )}
                <h1 className="text-4xl text-center md:text-center text-red-berry mb-0">{author?.fullName}</h1>
              </div>
              <div className="flex flex-col w-[300px] xl:w-[400px] gap-4 justify-center flex-1 mx-auto">
                {author?.description && (
                  <p className="text-center md:text-center text-red-berry">{author.description}</p>
                )}
                <ul className="flex flex-wrap gap-2 justify-center">
                  {author?.socialMediaLinks?.map((link) => (
                    <li key={link._key}>
                      <a
                        href={link.type === 'email' ? `mailto:${link.url}` : link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.type}
                      >
                        <SocialMediaIcon type={link.type} />
                        <span className="sr-only">{link.type}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <p>{pagination.totalPosts} innlegg</p>
                  {pagination.totalPages > 1 && (
                    <p className="text-sm">
                      Side {pagination.currentPage} av {pagination.totalPages}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className="flex xl:flex-[2] flex-col md:mr-4 xl:items-start">
            <PostPreviewList posts={posts} />
          </section>
        </div>
      )}
      <Pagination {...pagination} baseUrl={`/forfatter/${author.slug?.current}`} />
    </div>
  )
}

type SocialMediaIconProps = {
  type?: NonNullable<Author['socialMediaLinks']>[number]['type']
}
const SocialMediaIcon = ({ type }: SocialMediaIconProps) => {
  switch (type) {
    case 'instagram':
      return <InstagramIcon />
    case 'linkedIn':
      return <LinkedinIcon />
    case 'twitter':
      return <TwitterIcon />
    case 'bluesky':
      return <span aria-hidden="true">🦋</span>
    case 'gitHub':
      return <GithubIcon />
    case 'email':
      return <MailIcon />
    case 'website':
    default:
      return <GlobeIcon />
  }
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorPage
        title="Fant ikke den forfatteren"
        description="Det kan hende forfatteren du leter etter ikke finnes lenger, eller at du skrev inn feil URL."
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
