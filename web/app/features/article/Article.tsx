import { Fragment, ReactNode } from 'react'
import { PortableText } from '@portabletext/react'
import { Link, useNavigation } from '@remix-run/react'
import { formatDate } from 'utils/date'
import { readingTime } from 'utils/readingTime'
import { POST_BY_SLUGResult, SanityImageAsset } from 'utils/sanity/types/sanity.types'
import { urlFor } from 'utils/sanity/utils'

import { AudioPlayer } from './AudioPlayer'
import { RelatedLinks } from './RelatedLinks'

import { ArticleSpinner } from '~/components/ArticleSpinner'
import { TextLink } from '~/components/TextLink'
import { postUrl } from '~/lib/format'
import { components } from '~/portable-text/Components'
import PodcastBlock from '~/portable-text/PodcastBlock'
import VimeoBlock from '~/portable-text/VimeoBlock'

type ArticleProps = {
  post: POST_BY_SLUGResult
}

export const Article = ({ post }: ArticleProps) => {
  if (!post) {
    return null
  }
  const shouldShowSeriesBlock =
    post.series &&
    post.series.posts.length > 1 &&
    (post.series.shouldListNonPublishedContent
      ? true
      : post.series.posts.every((postInSeries) => postInSeries.isAvailable))
  return (
    <div className="px-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-12 xl:gap-x-24 md:gap-y-6 md:pl-10 xl:pl-20 pb-8 md:pb-16">
      <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8 md:min-w-[230px] lg:min-w-[240px] 2lg:min-w-[250px]">
        <h1 className="sm:mb-4 text-3xl sm:text-4xl">{post.title}</h1>
        {post.tags && (
          <div>
            {post.tags.map((tag, index) => (
              <Fragment key={tag._id}>
                <LinkWithSpinner to={`/kategori/${tag.slug}`} className="hover:text-reindeer-brown underline">
                  {tag.name}
                </LinkWithSpinner>
                {index !== (post.tags?.length ?? 0) - 1 && ', '}
              </Fragment>
            ))}
            <Border />
          </div>
        )}
        {((post.type === 'article' && post.content) || post.type === 'podcast') && (
          <div>
            {post.type === 'podcast' && post.podcastLength ? `${post.podcastLength} min` : readingTime(post.wordCount)}
            <Border />
          </div>
        )}
        {post.authors && (
          <div>
            Fra {''}
            {post.authors.map((author, index) => (
              <Fragment key={author._id}>
                <LinkWithSpinner
                  to={`/forfatter/${author.slug?.current}`}
                  className="hover:text-reindeer-brown underline"
                >
                  {author.fullName}
                </LinkWithSpinner>
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
        {shouldShowSeriesBlock && (
          <div className="p-2 bg-primary-foreground text-black rounded-sm">
            <div className="bg-red-600 text-sm text-white rounded-sm uppercase w-fit py-1 px-4 mb-4">Serie</div>
            <details>
              <summary className="text-2xl font-bold mb-2">{post.series?.title}</summary>
              <p className="text-md">{post.series?.description}</p>
              <ol className="list-disc ml-4 mt-8">
                {post.series?.posts
                  .filter((postInSeries) =>
                    post.series?.shouldListNonPublishedContent ? true : postInSeries.isAvailable
                  )
                  .map((postInSeries) => (
                    <li key={postInSeries._id}>
                      {postInSeries.isAvailable ? (
                        <TextLink
                          href={postUrl(postInSeries)}
                          className={`text-md ${postInSeries._id === post._id ? 'font-gt-standard-medium' : ''}`}
                          aria-current={postInSeries._id === post._id}
                        >
                          {postInSeries.title}
                        </TextLink>
                      ) : (
                        <span className="text-md">{postInSeries.title}</span>
                      )}
                    </li>
                  ))}
              </ol>
            </details>
          </div>
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
                  ? urlFor(post.coverImage.asset as unknown as SanityImageAsset)
                      .width(1700)
                      .quality(80)
                      .url()
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
            <RelatedLinks links={post.relatedLinks} language={post.language} />
          </div>
        )}
      </div>
    </div>
  )
}

export const Border = () => <div className="mb-8 border-b border-bekk-night pb-1" />

type LinkWithSpinnerProps = {
  to: string
  children: ReactNode
  className?: string
}
const LinkWithSpinner = ({ to, children, className }: LinkWithSpinnerProps) => {
  const navigation = useNavigation()
  const isNavigating = navigation.location?.pathname === to
  return (
    <Link to={to} className={className}>
      {children}
      {isNavigating && <ArticleSpinner />}
    </Link>
  )
}
