import { usePreviewData } from '@opengraphninja/react'
import { Link } from '@remix-run/react'
import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

type RelatedLinkElementProps = {
  link: NonNullable<NonNullable<POST_BY_SLUGResult>['relatedLinks']>[number]
  language: NonNullable<POST_BY_SLUGResult>['language']
}

export const RelatedLinkElement = ({ link, language }: RelatedLinkElementProps) => {
  const previewData = usePreviewData(link.url)

  if (previewData.status !== 'success') {
    const loadingText = language === 'en-US' ? 'Loading…' : 'Laster…'
    const errorText =
      language === 'en-US'
        ? 'Woops. An error has occured, and we are not able to find the link!'
        : 'Uffda. En feil har oppstått, og vi klarer ikke å hente lenken!'

    return (
      <div
        key={link._key}
        className="flex items-center pl-4 mt-4 bg-light-gray rounded-xl h-full max-h-20 min-h-20 sm:max-h-28 sm:min-h-28 hover:underline hover:shadow-md transition-shadow group"
      >
        <p> {previewData.status === 'loading' ? loadingText : errorText} </p>
      </div>
    )
  }

  if (!link.url) {
    return null
  }

  const url = new URL(link.url)

  return (
    <div
      key={link._key}
      className="flex mt-4 bg-light-gray rounded-xl h-full max-h-20 min-h-20 sm:max-h-28 sm:min-h-28 hover:underline hover:shadow-md transition-shadow group"
    >
      <Link to={link.url} className="flex w-full">
        <div className="flex flex-grow flex-col justify-center ml-5 w-[125px] no-underline">
          <h3 className="line-clamp-2 sm:line-clamp-2 text-base mb-1 sm:text-xl">
            {link.title ?? previewData.data.title}
          </h3>
          <p className="line-clamp-1 sm:line-clamp-2 text-sm">
            {link.description ?? previewData.data.description ?? previewData.data.details['ogTitle']}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center ml-2 max-sm:w-[0px] sm:w-[150px] md:w-[0px] xl:w-[150px] sm:ml-14 sm:mr-4 sm:m-2">
          {previewData.data.image && (
            <img
              src={previewData.data.image.url ?? `${url.origin}/favicon.ico`}
              alt={''}
              className="rounded-xl overflow-hidden"
            />
          )}
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
