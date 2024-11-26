import getYouTubeId from 'get-youtube-id'

import { Youtube } from '../../utils/sanity/types/sanity.types'

type YouTubeProps = {
  youtube: Youtube
}

export const YouTubeBlock = ({ youtube }: YouTubeProps) => {
  if (!youtube || !youtube.url) {
    return null
  }

  const id = getYouTubeId(youtube.url)

  return (
    <div className="aspect-video w-full">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  )
}
