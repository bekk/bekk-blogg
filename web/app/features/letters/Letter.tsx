import { readingTime } from 'utils/readTime'
import { toPlainText } from 'utils/sanity/utils'

import { Post } from '../../../utils/sanity/types/sanity.types'
import { PostStamp } from '../article/PostStamp'

type LetterProps = {
  post: Post
  showReadTime?: boolean
}

export const Letter = ({ post, showReadTime = true }: LetterProps) => {
  return (
    <div className="striped-frame min-w-full py-6 px-6 sm:p-7">
      <div className="grid  max-w-4xl sm:grid-cols-[1fr_1px_1fr] grid-cols-[30fr_1fr]">
        <div className="col-start-1 col-end-1 row-start-2 row-end-2 sm:mr-7">
          <h2 className="font-delicious sm:mb-20">{post.title}</h2>
        </div>
        <div className="col-start-2 row-start-1 row-end-4 hidden border-r border-bekk-night sm:block" />
        <div className="flex justify-end ml-1 sm:mb-9 col-start-3 col-end-3 row-start-2 row-end-3 sm:ml-7">
          <PostStamp size={'h-16,05 w-12 sm:h-21,4 sm:w-16 sm:h-[107px] sm:w-[80px]'} />{' '}
        </div>
        <div className="text-sm sm:text-lg col-start-1 col-end-1 row-start-3 row-end-3 sm:mr-7">
          {post.tags && (
            <>
              {post.tags.map((tag) => tag.name).join(', ')}
              <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" />
            </>
          )}
          {post.type === 'podcast' && post.podcastLength
            ? `${post.podcastLength} min`
            : showReadTime
              ? readingTime(post.content)
              : ''}
          {showReadTime ? <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" /> : null}
          {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
          <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" />
        </div>
        <div className="hidden sm:text-lg sm:block col-start-3 col-end-3 row-start-3 row-end-3 sm:ml-7">
          <p className="line-clamp-6"> {post.description && toPlainText(post.description)} </p>
        </div>
      </div>
    </div>
  )
}
