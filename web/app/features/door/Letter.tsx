import { Post } from '../../../utils/sanity/types/sanity.types'
import { PortableText } from '@portabletext/react'
import { PostStamp } from '~/features/article/PostStamp'
import readingTime from 'reading-time'

type LetterProps = {
  post: Post
}
export const Letter = ({ post }: LetterProps) => {
  return (
    <div className="striped-frame w-10/12 p-3 md:p-8">
      <div className="max-w-6xl grid sm:grid-cols-[auto] md:grid md:grid-rows-[auto]">
        <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 sm:mr-5 sm:p-5">
          <div className='max-sm:mb-8 sm:mb-20 max-sm:w-10/12'>
            <h2 className="font-delicious">{post.title}</h2>
          </div>
          {post.tags && post.tags.map((tag) => tag.name).join(', ')}
          <div className="max-sm:mb-3 mb-6 border-b border-bekk-night pb-1" />
          {readingTime(post.content?.toString() || '').text.replace('read', '')}
          <div className="max-sm:mb-3 mb-6 border-b border-bekk-night pb-1" />
          {post.authors && `Fra: ${post.authors.map((author) => author.fullName).join(', ')}`}
          <div className="max-sm:mb-3 mb-6 border-b border-bekk-night pb-1" />
        </div>
        <div className="col-start-2 row-start-1 row-end-13 hidden border-b border-r-2 border-bekk-night sm:block" />

        <div className="col-start-3 col-end-3 row-start-2 row-end-3 sm:ml-5">
          <div className="sm:mb-8 max-sm:ml-3 flex justify-end">
            <PostStamp />
          </div>
          <div className="hidden sm:block">{post.description && <PortableText value={post.description} />}</div>
        </div>
      </div>
    </div>
  )
}
