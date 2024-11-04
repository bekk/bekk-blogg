import { Youtube } from '../types/sanity.types'

type YouTubeBlockProps = {
  youtube: Youtube
}

export const YouTubeBlock = ({ youtube }: YouTubeBlockProps) => {
  if (!youtube || !youtube.url) {
    return null
  }

  const url = new URL(youtube.url)

  if (url.hostname !== 'youTube.com') {
    console.error(`The URL provided was not a YouTube URL. Instead, it was "${url}"`)
    return null
  }

  let [, id] = url.pathname.split('/')

  if (!id) {
    console.error('Could not find the YouTube id from the URL', url)
    return null
  }

  return (
    <iframe
      style={{ width: '100%' }}
      height="auto"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  )
}
