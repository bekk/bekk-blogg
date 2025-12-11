import { Link, useLocation, useRouteError } from 'react-router'

import { Search } from '~/components/Search'
import { BekkLogo } from '~/features/article/BekkLogo'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'

export const Header = () => {
  const breadcrumbs = useBreadcrumbs()
  const error = useRouteError()
  const location = useLocation()

  // Hide breadcrumbs on post.$year route and. post.$year.$date.$slug route
  const isPostYearRoute = /^\/post\/\d{4}\/??$/.test(location.pathname)
  const isPostYearDateSlugRoute = /^\/post\/\d{4}\/\d{1,2}\/[^\/]+\/?$/.test(location.pathname)
  const expandedHeader = !error && !isPostYearRoute && !isPostYearDateSlugRoute

  return (
    <div className={`flex flex-col gap-8 p-4 md:pb-8 px-4 md:px-10 md:pt-8`}>
      <div className="flex flex-row justify-between items-center gap-4 md:gap-8">
        <Link to="/" aria-label="Gå til forsiden">
          <BekkLogo className="h-auto w-10 md:auto md:w-16 text-red-berry" />
        </Link>

        <Search />
      </div>

      {expandedHeader && (
        <ol className="scrollbar-none flex overflow-x-auto mt-4 md:mt-0">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <li key={index} className="flex-none min-w-0 flex items-center whitespace-nowrap" aria-label="Brødsmuler">
                <Link
                  to={`${breadcrumb.href}`}
                  className={`text-red-berry ${isLast ? 'truncate' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {breadcrumb.title}
                </Link>
                {!isLast && <p className={`shrink-0 px-2 text-red-berry`}>/</p>}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default Header
