import { usePreviewData } from '@opengraphninja/react'
import { Link } from 'react-router'
import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

type RelatedLinkElementProps = {
  link: NonNullable<NonNullable<POST_BY_SLUGResult>['relatedLinks']>[number]
  language: NonNullable<POST_BY_SLUGResult>['language']
}

export const RelatedLinkElement = ({ link, language }: RelatedLinkElementProps) => {
  const previewData = usePreviewData(link.url)

  if (previewData.status === 'loading') {
    const loadingText = language === 'en-US' ? 'Loading…' : 'Laster…'

    return (
      <div
        key={link._key}
        className="flex items-center pl-4 mt-4 bg-light-gray rounded-xl h-full max-h-20 min-h-20 sm:max-h-28 sm:min-h-28 hover:underline hover:shadow-md transition-shadow group"
      >
        <p>{loadingText}</p>
      </div>
    )
  }

  if (!link.url) {
    return null
  }

  const url = new URL(link.url)

  const title = link.title ?? (previewData.status === 'success' ? previewData.data.title : link.url)
  const description =
    link.description ??
    (previewData.status === 'success'
      ? (previewData.data?.description ?? previewData.data?.details['ogTitle'] ?? url.hostname)
      : url.hostname)
  const image = previewData.status === 'success' ? (previewData.data?.image?.url ?? `${url.origin}/favicon.ico`) : null

  return (
    <div
      key={link._key}
      className="flex mt-4 bg-light-gray rounded-xl h-full max-h-20 min-h-20 sm:max-h-28 sm:min-h-28 hover:underline hover:shadow-md transition-shadow group"
    >
      <Link to={link.url} className="flex w-full">
        <div className="flex flex-grow flex-col justify-center ml-5 w-[125px] no-underline">
          <h3 className="line-clamp-2 sm:line-clamp-2 text-base mb-1 sm:text-xl">{title}</h3>
          <p className="line-clamp-1 sm:line-clamp-2 text-sm">{description}</p>
        </div>
        <div className="flex flex-col justify-center items-center ml-2 max-sm:w-[0px] sm:w-[150px] md:w-[0px] xl:w-[150px] sm:ml-14 sm:mr-4 sm:m-2">
          {image && <img src={image} alt={''} className="rounded-xl overflow-hidden" />}
        </div>
        <div className="sm:hidden md:flex md:items-center xl:hidden flex ml-auto items-center mr-4 sm:mr-4 sm:mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transform transition-transform group-hover:translate-x-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  )
}
