import React from 'react'
import getYouTubeId from 'get-youtube-id'
import YouTube from 'react-youtube'
import { Youtube as YouTubeSanityType } from '../types/sanity.types'
// import useMediaQuery from '~/hooks/useMediaQuery'

type YouTubeProps = {
  youtube: YouTubeSanityType
}

export const YouTubeBlock = ({ youtube }: YouTubeProps) => {
  // const isSm = useMediaQuery('(min-width: 640px)')
  // const height = isSm ? '500px' : '300px'

  if (!youtube || !youtube.url) {
    return null
  }

  const id = getYouTubeId(youtube.url)

  return (
    <div>
      <YouTube videoId={id as string} opts={{ width: '100%', height: '100%' }} />
    </div>
  )
}
