import { Link, useMatches, useParams, useRouteError } from '@remix-run/react'

import { PostStamp } from '../article/PostStamp'

import { BekkLogo } from '~/features/article/BekkLogo'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'
import algoliasearch from 'algoliasearch'
import { Search } from '~/components/Search'
import { useRef } from 'react'

const useAlgoliaConfig = () => {
  const rootMatch = useMatches().find((match) => match.id === 'root')
  return (rootMatch?.data as { algolia: { app: string; key: string; index: string } })?.algolia
}

export const Header = () => {
  const algolia = useAlgoliaConfig()
  const breadcrumbs = useBreadcrumbs()
  const error = useRouteError()
  const { year, date, slug } = useParams()
  const isOnArticlePage = Boolean(year && date && slug)
  const searchClient = useRef(algolia && algoliasearch(algolia.app, algolia.key))

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[8fr_1fr] p-4 md:pb-14 ${isOnArticlePage ? 'pt-6 px-6 md:pl-10 xl:pl-20 md:pt-5' : 'px-4 md:px-10 md:pt-8'}`}
    >
      <div className={`justify-self-end md:col-start-2 ${error ? 'ml-auto' : ''}`}>
        <Link to="/" aria-label="Gå til forsiden">
          {isOnArticlePage ? (
            <div>
              <PostStamp />
            </div>
          ) : (
            <div>
              <BekkLogo className="h-auto w-10 md:auto md:w-16" />
            </div>
          )}
        </Link>
      </div>
      {algolia && searchClient && (
        <div className="md:col-start-1 md:col-span-2 md:row-start-1 flex justify-start md:justify-center order-first md:order-none  md:mx-auto">
          <Search searchClient={searchClient} indexName={algolia.index} />
        </div>
      )}
      {!error && (
        <div className="col-span-2 md:col-span-1 md:row-start-2 min-w-0 flex-1 md:content-end">
          <ol className="scrollbar-none flex overflow-x-auto mt-4 md:mt-0">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <li key={index} className="flex-none min-w-0 flex items-center whitespace-nowrap">
                  <Link
                    to={`${breadcrumb.href}`}
                    className={`${isOnArticlePage ? 'text-black' : 'text-postcard-beige'} ${isLast ? 'truncate' : ''}`}
                  >
                    {breadcrumb.title}
                  </Link>
                  {!isLast && (
                    <p className={`shrink-0 px-2 ${isOnArticlePage ? 'text-black' : 'text-postcard-beige'}`}>/</p>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

export default Header
