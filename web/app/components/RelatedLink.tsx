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
    <div key={link._key} className="mt-2 bg-red-100 rounded-xl hover:underline hover:shadow-md transition-shadow group">
      <Link to={link.url}>
        <div className="flex flex-row w-full">
          {previewData.data.image && (
            <img
              src={previewData.data.image.url}
              alt={previewData.data.image.alt}
              className="flex flex-col justify-center m-2 mr-4 object-cover rounded-xl max-h-[50px] max-w-[100px] sm:mr-10 sm:m-4 md:max-h-[150px] md:max-w-[230px] "
            />
          )}
          <div className="flex flex-col justify-center max-w-[450px] no-underline">
            <h3 className="line-clamp-2 sm:line-clamp-3 text-sm sm:text-xl">
              {link.title ?? previewData.data.title}
            </h3>
            <p className="line-clamp-1 sm:line-clamp-3 text-sm">{link.description ?? previewData.data.description}</p>
          </div>
          <div className="ml-auto flex items-end mr-2 mb-2 sm:mr-4 sm:mb-4">
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
        </div>
      </Link>
    </div>
  )
}
