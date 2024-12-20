import { PortableText } from '@portabletext/react'
import { Link, useActionData, useNavigation } from '@remix-run/react'
import { Fragment, ReactNode } from 'react'
import { formatDate } from 'utils/date'
import { readingTime } from 'utils/readingTime'
import { POST_BY_SLUGResult, SanityImageAsset } from 'utils/sanity/types/sanity.types'
import { urlFor } from 'utils/sanity/utils'

import { AudioPlayer } from './AudioPlayer'
import { LikeContent } from './LikeContent'
import { RelatedLinks } from './RelatedLinks'

import { ArticleSpinner } from '~/components/ArticleSpinner'
import { components } from '~/portable-text/Components'
import PodcastBlock from '~/portable-text/PodcastBlock'
import VimeoBlock from '~/portable-text/VimeoBlock'
import { action } from '~/routes/post.$year.$date.$slug'
import Series, { shouldShowSeries } from './Series'
import { NewsletterForm } from '../calendar/NewsletterForm'

type ArticleProps = {
  post: POST_BY_SLUGResult
}

export const Article = ({ post }: ArticleProps) => {
  const { state } = useNavigation()
  const actionResponse = useActionData<typeof action>()

  if (!post) {
    return null
  }

  const points =
    state === 'submitting'
      ? (post?.points ?? 0) + 1
      : actionResponse?.status === 'success'
        ? actionResponse.points
        : (post?.points ?? 0)

  const shouldShowSeriesBlock = shouldShowSeries(post)

  return (
    <section className="px-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-12 xl:gap-x-24 md:gap-y-6 md:pl-10 xl:pl-20 pb-8 md:pb-16">
      <aside className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8 md:min-w-[230px] lg:min-w-[240px] 2lg:min-w-[250px]">
        {shouldShowSeriesBlock && (
          <div className="border-[3px] border-santa-red w-fit px-[10px] py-[4px] font-gt-expanded text-sm rounded-sm mb-6 hidden md:block uppercase">
            Del av en serie
          </div>
        )}
        <h1 className="sm:mb-4 text-3xl sm:text-4xl overflow-auto">{post.title}</h1>
        {post.tags && (
          <div>
            {post.tags.filter(Boolean).map((tag, index) => (
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
            {post.authors.filter(Boolean).map((author, index) => (
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
        {points > 0 && (
          <>
            <p>
              {points} anbefaler {formatType(post.type)}
            </p>
            <Border />
          </>
        )}
        {post.type === 'article' && (
          <AudioPlayer
            src={`https://bekk-blogg-tts.vercel.app/tts?id=${post._id}`}
            slug={post.slug?.current ?? 'unknown'}
          />
        )}
        {shouldShowSeriesBlock && post.series && <Series postId={post._id} series={post.series} mobileOnly={false} />}
      </aside>
      <article className="flex flex-col col-start-2 col-end-2 row-start-2 row-end-2 max-md:max-w-screen-xl max-lg:max-w-[475px] max-2lg:max-w-[550px] 2lg:max-w-[675px] xl:pr-10 xl:max-w-3xl 2xl:max-w-4xl">
        {post?.description ? (
          <div className="text-xl remove-margin">
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
            {post.coverImage.asset ? (
              <img
                src={urlFor(post.coverImage.asset as SanityImageAsset)
                  .width(1700)
                  .quality(80)
                  .url()}
                srcSet={[400, 800, 1200, 1700]
                  .map((width) => {
                    const url = urlFor(post.coverImage!.asset as SanityImageAsset)
                      .width(width)
                      .quality(80)
                      .url()
                    return `${url} ${width}w`
                  })
                  .join(', ')}
                sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1700px"
                alt={post.coverImage.alt || ''}
                className="w-full rounded-2xl object-cover max-w-full"
                style={{
                  aspectRatio: post.coverImage.asset?.metadata?.dimensions?.aspectRatio ?? undefined,
                }}
              />
            ) : (
              <img
                src={post.coverImage.src ?? ''}
                alt={post.coverImage.alt || ''}
                className="w-full rounded-2xl object-cover max-w-full"
              />
            )}
          </div>
        )}
        {post.content && (
          <div className="remove-margin leading-8">
            <PortableText value={post.content} components={components} />
          </div>
        )}
        {post.relatedLinks && (
          <div className="md:max-w-lg lg:max-w-xl xl:max-w-4xl leading-8">
            <RelatedLinks links={post.relatedLinks} language={post.language} />
          </div>
        )}

        <LikeContent id={post._id} language={post.language} />
        <div className="mt-8 flex justify-center border-t border-bekk-night">
          <div className="w-auto mt-8">
            <NewsletterForm />
          </div>
        </div>
      </article>
    </section>
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

const formatType = (type: NonNullable<POST_BY_SLUGResult>['type']) => {
  switch (type) {
    case 'article':
      return 'denne artikkelen'
    case 'podcast':
      return 'denne podcasten'
    case 'video':
      return 'denne videoen'
    default:
      return 'dette innlegget'
  }
}
