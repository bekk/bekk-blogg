import {PortableText} from '@portabletext/react'
import { Post } from 'utils/sanity/types/sanity.types'

import { PostStamp } from '~/features/article/PostStamp'
import { formatDate } from 'utils/date'
import { components } from "~/portable-text/Components";


type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="md:grid sm:grid-cols-[1fr_2fr] md:grid-rows-[auto_auto] md:gap-x-24 md:gap-y-6 p-6 md:p-20">
      <div className="col-start-2 col-end-2 row-start-1 row-end-1 md:text-right flex justify-end">
        <PostStamp />
      </div>
      <div className="col-start-1 col-span-2 row-start-1 row-end-1 hidden">breadcrumbs</div>
      <div className="col-start-1 col-end-1 row-start-2 row-end-2 meta mb-8">
        <h1 className="font-delicious mb-8">{post.title}</h1>
        <div className="text-body-mobile md:text-body-desktop border-b border-bekk-night pb-1 mb-8">
          {post.tags && post.tags.map((tag) => tag.name).join(', ')}
        </div>
        <div className="text-body-mobile md:text-body-desktop border-b border-bekk-night pb-1 mb-8">
          {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
        </div>
        <div className="text-body-mobile md:text-body-desktop border-b border-bekk-night pb-1">
          {post.availableFrom && formatDate(post.availableFrom)}
        </div>
      </div>
      <div className="col-start-2 col-end-2 row-start-2 row-end-2">
        {post?.description && (
          <div className="text-leading-mobile md:text-leading-desktop mb-10">
            <PortableText value={post.description} components={components} />
          </div>
        )}
        {post?.content && (
          <div className="text-body-mobile md:text-body-desktop">
            <PortableText value={post.content} components={components} />
          </div>
        )}
      </div>
    </div>
  )
}
