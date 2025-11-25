import { Link, useRouteError } from 'react-router'

import { PostStamp } from './PostStamp'

import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'

export const ArticleHeader = () => {
  const breadcrumbs = useBreadcrumbs()
  const error = useRouteError()

  return (
    <div
      className={`flex flex-row justify-between flex-wrap-reverse items-start p-4 md:pb-8 pt-6 px-6 md:pl-10 xl:pl-20 md:pt-5 `}
    >
      {!error && (
        <ol className="scrollbar-none flex overflow-x-auto mt-4 md:mt-0">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <li key={index} className="flex-none min-w-0 flex items-center whitespace-nowrap">
                <Link to={`${breadcrumb.href}`} className={`text-black ${isLast ? 'truncate' : ''}`}>
                  {breadcrumb.title}
                </Link>
                {!isLast && <p className={`shrink-0 px-2 text-black`}>/</p>}
              </li>
            )
          })}
        </ol>
      )}
      <Link to="/" aria-label="Gå til forsiden">
        <PostStamp />
      </Link>
    </div>
  )
}
