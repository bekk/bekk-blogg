import { Fragment, useRef, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Link } from '@remix-run/react'
import { Loader, Pause, Play } from 'lucide-react'
import { trackEvent } from 'utils/analytics'
import { formatDate } from 'utils/date'
import { readingTime } from 'utils/readTime'
import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'
import { urlFor } from 'utils/sanity/utils'

import { RelatedLinks } from './RelatedLinks'

import { components } from '~/portable-text/Components'
import PodcastBlock from '~/portable-text/PodcastBlock'
import VimeoBlock from '~/portable-text/VimeoBlock'

type ArticleProps = {
  post: POST_BY_SLUGResult
}

const AudioPlayer = ({ src, slug }: { src: string; slug: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!isInitialized && audioRef.current) {
      // Initialize audio source on first play
      audioRef.current.src = src
      setIsInitialized(true)
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        trackEvent('article_audio_played', { slug })
      }
    }
  }

  return (
    <div className="mb-6 flex items-center gap-2">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-bekk-night text-white flex items-center justify-center hover:bg-opacity-90 transition-colors"
      >
        {isLoading ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </button>
      <p className="text-md text-bekk-night">
        {isLoading ? 'Varmer opp stemmen' : isPlaying ? 'Leser høyt for deg…' : 'Høytlesning'}
      </p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption*/}
      <audio
        ref={audioRef}
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />
    </div>
  )
}

export const Article = ({ post }: ArticleProps) => {
  if (!post) {
    return null
  }
  return (
    <div className="px-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-12 xl:gap-x-24 md:gap-y-6 md:pl-10 xl:pl-20 pb-8 md:pb-16">
      <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8 md:min-w-[230px] lg:min-w-[240px] 2lg:min-w-[250px]">
        <h1 className="sm:mb-4 text-3xl sm:text-4xl font-delicious">{post.title}</h1>
        {post.tags && (
          <div>
            {post.tags.map((tag, index) => (
              <Fragment key={tag._id}>
                <Link to={`/tags/${tag.slug}`} className="hover:text-reindeer-brown underline">
                  {tag.name}
                </Link>
                {index !== (post.tags?.length ?? 0) - 1 && ', '}
              </Fragment>
            ))}
            <Border />
          </div>
        )}
        {((post.type === 'article' && post.content) || post.type === 'podcast') && (
          <div>
            {post.type === 'podcast' && post.podcastLength
              ? `${post.podcastLength} min`
              : readingTime(post.content ?? [])}
            <Border />
          </div>
        )}
        {post.authors && (
          <div>
            Fra {''}
            {post.authors.map((author, index) => (
              <Fragment key={author._id}>
                <Link to={`/author/${author.slug?.current}`} className="hover:text-reindeer-brown underline">
                  {author.fullName}
                </Link>
                {index !== post.authors.length - 1 && ', '}
              </Fragment>
            ))}
          </div>
        )}
        <Border />
        {post.availableFrom && formatDate(post.availableFrom)}
        <Border />
        {post.type === 'article' && (
          <AudioPlayer src={`/api/tts?id=${post._id}`} slug={post.slug?.current ?? 'unknown'} />
        )}
      </div>
      <div className="flex flex-col col-start-2 col-end-2 row-start-2 row-end-2 max-md:max-w-screen-xl max-lg:max-w-[475px] max-2lg:max-w-[550px] 2lg:max-w-[675px] xl:pr-10 xl:max-w-3xl 2xl:max-w-4xl">
        {post?.description ? (
          <div className="text-xl">
            <PortableText value={post.description} components={components} />
          </div>
        ) : null}
        {post.type === 'podcast' && post.embedUrl && (
          <PodcastBlock podcast={{ src: post.embedUrl, title: post.title ?? 'podcast' }} />
        )}
        {post.type === 'video' && post.embedUrl && (
          <VimeoBlock video={{ src: post.embedUrl, title: post.title ?? 'video' }} />
        )}
        {post.coverImage && !post.coverImage.hideFromPost && (
          <div className="mb-7">
            <img
              src={
                post.coverImage.asset
                  ? urlFor(post.coverImage.asset._id).width(1700).quality(80).url()
                  : (post.coverImage.src ?? '')
              }
              alt={post.coverImage.alt || ''}
              className="w-full rounded-2xl object-cover max-w-full"
              style={{
                aspectRatio: post.coverImage.asset?.metadata?.dimensions?.aspectRatio ?? undefined,
              }}
            />
          </div>
        )}
        {post.content && (
          <div className="leading-8">
            <PortableText value={post.content} components={components} />
          </div>
        )}
        {post.relatedLinks && (
          <div className="md:max-w-lg lg:max-w-xl xl:max-w-4xl leading-8">
            <RelatedLinks links={post.relatedLinks} />
          </div>
        )}
      </div>
    </div>
  )
}

export const Border = () => <div className="mb-8 border-b border-bekk-night pb-1" />
