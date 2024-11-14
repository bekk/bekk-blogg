import { Link } from '@remix-run/react'

import { BekkLogo } from '~/features/article/BekkLogo'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'

type HeaderProps = {
  isInArticle?: boolean
}
export const Header = ({ isInArticle = false }: HeaderProps) => {
  const breadcrumbs = useBreadcrumbs()
  //const styling = `${isInArticle ? '' : ' md:pt-8'}`
  return (
    <div className={`md:px-10 md:pt-8`}>
      {!isInArticle && (
        <div className="flex justify-end p-4">
          <Link to={'/'}>
            <BekkLogo fillColor={'fill-black'} />
          </Link>
        </div>
      )}
      <div className="flex justify-start">
        <ol className="flex px-4">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex">
              <Link to={breadcrumb.href} key={index} className={isInArticle ? 'text-black' : `text-reindeer-brown`}>
                {breadcrumb.title}
              </Link>
              {index === breadcrumbs.length - 1 ? null : <p className="px-2 text-reindeer-brown">/</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
