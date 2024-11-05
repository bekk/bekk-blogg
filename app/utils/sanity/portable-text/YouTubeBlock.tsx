import React from 'react'
import getYouTubeId from 'get-youtube-id'
import YouTube from 'react-youtube'

export const YouTubeBlock = ({ node }: any) => {
  if (!node) {
    return null
  }
  const id = getYouTubeId(node.url || node.src)
  return (
    <div className="h-[32rem]">
      <YouTube videoId={id as string} opts={{ width: '100%', height: '300px' }} />
    </div>
  )
}
