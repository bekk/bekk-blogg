import {Youtube} from '../../utils/sanity/types/sanity.types'
import useMediaQuery from '~/hooks/useMediaQuery'
import getYouTubeId from 'get-youtube-id'

type YouTubeProps = {
  youtube: Youtube
}

export const YouTubeBlock = ({youtube}: YouTubeProps) => {
  const isSm = useMediaQuery('(min-width: 640px)')
  const height = isSm ? '500px' : '300px'

  if (!youtube || !youtube.url) {
    return null
  }

  const id = getYouTubeId(youtube.url)

  return (
    <div>
      <iframe
        width="100%"
        height={height}
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  )
}
