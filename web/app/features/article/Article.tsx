import { PortableText } from '@portabletext/react'
import { formatDate } from 'utils/date'
import { Post } from 'utils/sanity/types/sanity.types'

import { PostStamp } from '~/features/article/PostStamp'
import { components } from '~/portable-text/Components'
import ImageBlock from '~/portable-text/ImageBlock'
import readingTime from 'reading-time'

type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="p-6 sm:grid-cols-[1fr_2fr] md:grid md:grid-rows-[auto_auto] md:gap-x-24 md:gap-y-6 md:p-20">
      <div className="col-start-2 col-end-2 row-start-1 row-end-1 flex justify-end md:text-right">
        <PostStamp />
      </div>
      <div className="col-span-2 col-start-1 row-start-1 row-end-1 hidden">breadcrumbs</div>
      <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8">
        <h1 className="mb-8 font-delicious">{post.title}</h1>
        {post.tags && (
          <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
            {post.tags.map((tag) => tag.name).join(', ')}
          </div>
        )}
        {post.content && (
          <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop">
            {readingTime(post.content.toString() || '').text.replace('read', '')}
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
        {post.coverImage && !post.coverImage.hideFromPost && (
          <ImageBlock image={{ ...post.coverImage, _type: 'imageWithMetadata' }} />
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
