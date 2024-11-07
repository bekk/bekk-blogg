import { PortableText } from '@portabletext/react'
import { components } from 'utils/sanity/portable-text/Components'
import { Post } from 'utils/sanity/types/sanity.types'

type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="p-6 sm:grid-cols-[auto_auto] md:grid md:grid-rows-[auto_auto] md:gap-20 md:p-20">
      <div className="col-start-2 col-end-2 row-start-1 row-end-1 md:text-right">poststamp</div>
      <div className="col-span-2 col-start-1 row-start-1 row-end-1 hidden">breadcrumbs</div>
      <div className="col-start-1 col-end-1 row-start-2 row-end-2 mb-8">
        <h1 className="mb-4 font-delicious">{post.title}</h1>
      </div>
      <div className="col-start-2 col-end-2 row-start-2 row-end-2">
        {post?.description && (
          <div className="mb-10 text-leading-mobile md:text-leading-desktop">
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
