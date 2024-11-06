import { PortableText } from '@portabletext/react'
import { components } from 'utils/sanity/portable-text/Components'
import { Post } from 'utils/sanity/types/sanity.types'

type ArticleProps = {
  post: Post
}

export const Article = ({ post }: ArticleProps) => {
  return (
    <div className="md:grid sm:grid-cols-[auto_auto] md:grid-rows-[auto_auto] md: gap-12">
      <div className="col-start-2 col-end-2 row-start-1 row-end-1 md:text-right">poststamp</div>
      <div className="col-start-1 col-span-2 row-start-1 row-end-1">breadcrumbs</div>
      <div className="col-start-1 col-end-1 row-start-2 row-end-2 meta">
        <h1>{post.title}</h1>
      </div>
      <div className="col-start-2 col-end-2 row-start-2 row-end-2">
        {post?.description && (
          <div className="text-leading-mobile sm:text-leading-desktop mb-10">
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
