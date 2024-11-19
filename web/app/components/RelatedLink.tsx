import { usePreviewData } from '@opengraphninja/react'
import { Link } from '@remix-run/react'
import { RelatedLink } from 'utils/sanity/types/sanity.types'

type RelatedLinkElementProps = {
  link: RelatedLink
}

export const RelatedLinkElement = ({ link }: RelatedLinkElementProps) => {
  const previewData = usePreviewData(link.url)
  if (previewData.status !== 'success') {
    return <p>Loading…</p>
  }

  if (!link.url) {
    return <p>Ups, her må det ha skjedd en feil. </p>
  }

  return (
    <div
      key={link._key}
      className="flex mt-2 bg-santa-red/25 rounded-xl h-full max-h-24 min-h-24 hover:underline hover:shadow-md transition-shadow group"
    >
      <Link to={link.url} className="flex w-full">
        <div className="flex flex-grow flex-col justify-center ml-5 w-[125px] no-underline">
          <h3 className="line-clamp-2 sm:line-clamp-3 text-base sm:text-xl">{link.title ?? previewData.data.title}</h3>
          <p className="line-clamp-1 sm:line-clamp-3 text-sm">
            {link.description ?? previewData.data.description ?? previewData.data.details['ogTitle']}
          </p>
          <p className="line-clamp-1 sm:line-clamp-2 text-sm">{link.url}</p>
        </div>
        <div className="flex flex-col justify-center items-center ml-2 max-sm:w-[0px] sm:w-[150px] md:w-[0px] xl:w-[150px] sm:ml-14 sm:mr-8 sm:m-2">
          {previewData.data.image && (
            <img
              src={previewData.data.image ? previewData.data.image.url : `${new URL(link.url)}/favicon.ico`}
              alt={previewData.data.image ? previewData.data.image.alt : `${new URL(link.url)}/favicon.ico`}
              className="rounded-xl"
            />
          )}
        </div>
        <div className="flex ml-auto items-end mr-2 mb-2 sm:mr-4 sm:mb-4">
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
