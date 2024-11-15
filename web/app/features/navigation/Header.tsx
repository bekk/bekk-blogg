import { Link } from '@remix-run/react'

import { PostStamp } from '../article/PostStamp'

import { BekkLogo } from '~/features/article/BekkLogo'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'

type HeaderProps = {
  isInArticle?: boolean
}

export const Header = ({ isInArticle = false }: HeaderProps) => {
  const breadcrumbs = useBreadcrumbs()

  return (
    <div
      className={`flex items-end justify-between pb-8 md:pb-14 ${isInArticle ? 'pt-6 px-2 md:px-16 md:pt-5' : 'pt-4 md:px-10 md:pt-8'}`}
    >
      <div className="min-w-0 flex-1">
        <ol className="scrollbar-none flex overflow-x-auto px-4">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <li
                key={index}
                className={`flex min-w-0 items-center whitespace-nowrap ${isLast ? 'shrink' : 'shrink-0'}`}
              >
                <Link
                  to={breadcrumb.href}
                  className={`${isInArticle ? 'text-black' : 'text-reindeer-brown'} ${isLast ? 'truncate' : ''}`}
                >
                  {breadcrumb.title}
                </Link>
                {!isLast && <p className="shrink-0 px-2 text-reindeer-brown">/</p>}
              </li>
            )
          })}
        </ol>
      </div>
      <div className="shrink-0 px-4">
        <Link to="/">
          {isInArticle ? (
            <PostStamp />
          ) : (
            <BekkLogo className="h-21.4 w-10 md:h-[107px] md:w-16" fillColor="fill-black" />
          )}
        </Link>
      </div>
    </div>
  )
}

export default Header
