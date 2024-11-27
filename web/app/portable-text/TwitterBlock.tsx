import { TwitterTweetEmbed } from 'react-twitter-embed'

import { Twitter } from '../../utils/sanity/types/sanity.types'

const getTweetId = (url?: string) => {
  if (!url) {
    return null
  }
  const parsedUrl = new URL(url)
  return parsedUrl.pathname.split('/').pop()
}

type TwitterBlockProps = {
  twitter: Twitter
}

export default function TwitterBlock({ twitter }: TwitterBlockProps) {
  const id = getTweetId(twitter?.url ?? undefined)
  if (!id) {
    return null
  }
  return (
    <div className="h-[550px] w-full overflow-y-auto">
      <TwitterTweetEmbed tweetId={id} />
    </div>
  )
}
