import { PortableText } from '@portabletext/react'
import { readingTime } from 'utils/readTime'

import { Post } from '../../../utils/sanity/types/sanity.types'

import { PostStamp } from '~/features/article/PostStamp'

type LetterProps = {
  post: Post
}
export const Letter = ({ post }: LetterProps) => {
  return (
    <div className="striped-frame min-w-full max-sm:p-3 sm:p-7">
      <div className="grid max-w-4xl grid-cols-[1fr_1px_1fr] max-sm:grid-cols-[30fr_1fr]">
        <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 sm:mr-7">
          <div className="max-sm:mb-7 sm:mb-20">
            <h2 className="font-delicious">{post.title}</h2>
          </div>
          {post.tags && (
            <>
              {post.tags.map((tag) => tag.name).join(', ')}
              <div className="mb-7 border-b border-bekk-night pb-1 max-sm:mb-3" />
            </>
          )}
          {post.type === 'podcast' && post.podcastLength ? `${post.podcastLength} min` : readingTime(post.content)}
          <div className="mb-7 border-b border-bekk-night pb-1 max-sm:mb-3" />
          {post.authors && `Fra: ${post.authors.map((author) => author.fullName).join(', ')}`}
          <div className="mb-7 border-b border-bekk-night pb-1 max-sm:mb-3" />
        </div>
        <div className="col-start-2 row-start-1 row-end-3 hidden border-r border-bekk-night sm:block" />

        <div className="col-start-3 col-end-3 row-start-2 row-end-3 sm:ml-7">
          <div className="flex justify-end max-sm:ml-1 sm:mb-9">
            <PostStamp />
          </div>
          <div className="hidden sm:block">{post.description && <PortableText value={post.description} />}</div>
        </div>
      </div>
    </div>
  )
}
