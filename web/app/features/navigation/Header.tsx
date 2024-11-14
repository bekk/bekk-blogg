import { Link } from '@remix-run/react'

import { BekkLogo } from '~/features/article/BekkLogo'
import { PostStamp } from '~/features/article/PostStamp'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'

type HeaderProps = {
  isInArticle?: boolean
}
export const Header = ({ isInArticle = false }: HeaderProps) => {
  const breadcrumbs = useBreadcrumbs()

  return (
    <div className={`flex items-end justify-between ${isInArticle ? 'md:px-6 md:pt-5' : 'md:px-10 md:pt-8'} `}>
      <div>
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
      <div className={'px-4'}>
        <Link to={'/'}>
          {isInArticle ? <PostStamp /> : <BekkLogo className={'md:h-[107px]'} fillColor={'fill-black'} />}
        </Link>
      </div>
    </div>
  )
}
