import { PortableText } from '@portabletext/react'
import { formatDate } from 'utils/date'
import { readingTime } from 'utils/readTime'
import { Post } from 'utils/sanity/types/sanity.types'

import { components } from '~/portable-text/Components'
import ImageBlock from '~/portable-text/ImageBlock'
import PodcastBlock from '~/portable-text/PodcastBlock'

type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="px-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-24 md:gap-y-6 md:px-20">
      <div className="col-span-2 col-start-1 row-start-1 row-end-1 hidden">breadcrumbs</div>
      <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8">
        <h1 className="mb-8 font-delicious md:mb-12">{post.title}</h1>
        {post.tags && (
          <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
            {post.tags.map((tag) => tag.name).join(', ')}
          </div>
        )}
        {((post.type === 'article' && post.content) || post.type === 'podcast') && (
          <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
            {post.type === 'podcast' && post.podcastLength ? `${post.podcastLength} min` : readingTime(post.content)}
          </div>
        )}
        <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
          {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
        </div>
        <div className="border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
          {post.availableFrom && formatDate(post.availableFrom)}
        </div>
      </div>
      <div className="col-start-2 col-end-2 row-start-2 row-end-2">
        {post?.description && (
          <div className="mb-10 text-leading-mobile md:text-leading-desktop">
            <PortableText value={post.description} components={components} />
          </div>
        )}
        {post.type === 'podcast' && post.embedUrl && (
          <PodcastBlock podcast={{ src: post.embedUrl, title: post.title ?? 'podcast' }} />
        )}
        {post.coverImage && !post.coverImage.hideFromPost && (
          <div className="mb-7">
            <ImageBlock image={{ ...post.coverImage, _type: 'imageWithMetadata' }} />
          </div>
        )}
        {post?.content && (
          <div className="md:max-w-lg lg:max-w-xl xl:max-w-4xl">
            <PortableText value={post.content} components={components} />
          </div>
        )}
      </div>
    </div>
  )
}
