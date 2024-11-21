import { PortableText } from '@portabletext/react'
import { formatDate } from 'utils/date'
import { readingTime } from 'utils/readTime'
import { Post } from 'utils/sanity/types/sanity.types'

import { RelatedLinks } from './RelatedLinks'

import { components } from '~/portable-text/Components'
import ImageBlock from '~/portable-text/ImageBlock'
import PodcastBlock from '~/portable-text/PodcastBlock'
import VimeoBlock from '~/portable-text/VimeoBlock'

type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="px-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-12 xl:gap-x-24 md:gap-y-6 md:pl-20 pb-8 md:pb-16">
      <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8">
        <h1 className="mb-8 font-delicious md:mb-12">{post.title}</h1>
        {post.tags && (
          <div>
            {post.tags.map((tag) => tag.name).join(', ')}
            <Border />
          </div>
        )}
        {((post.type === 'article' && post.content) || post.type === 'podcast') && (
          <div>
            {post.type === 'podcast' && post.podcastLength ? `${post.podcastLength} min` : readingTime(post.content)}
            <Border />
          </div>
        )}
        {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
        <Border />
        {post.availableFrom && formatDate(post.availableFrom)}
        <Border />
      </div>
      <div className="col-start-2 col-end-2 row-start-2 row-end-2 max-md:max-w-screen-xl max-lg:max-w-lg max-xl:max-w-xl">
        {post?.description && (
          <h3 className="mb-10">
            <PortableText value={post.description} components={components} />
          </h3>
        )}
        {post.type === 'podcast' && post.embedUrl && (
          <PodcastBlock podcast={{ src: post.embedUrl, title: post.title ?? 'podcast' }} />
        )}
        {post.type === 'video' && post.embedUrl && (
          <VimeoBlock video={{ src: post.embedUrl, title: post.title ?? 'video' }} />
        )}
        {post.coverImage && !post.coverImage.hideFromPost && (
          <div className="mb-7">
            <ImageBlock image={{ ...post.coverImage, _type: 'imageWithMetadata' }} />
          </div>
        )}
        {post?.content && (
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
