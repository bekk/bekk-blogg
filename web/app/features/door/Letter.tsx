import { Post } from '../../../utils/sanity/types/sanity.types'
import { PortableText } from '@portabletext/react'
import { PostStamp } from '~/features/article/PostStamp'
import readingTime from "reading-time";


type LetterProps = {
  post: Post
}
export const Letter = ({ post }: LetterProps) => {
  return (
    <div className="striped-frame w-10/12 p-3 md:p-8">
      <div className="sm:grid-cols-[1000fr_1fr_1000fr] md:grid md:grid-rows-[auto_auto] max-w-6xl">
        <div className="meta col-start-1 col-end-1 row-start-2 row-end-2 mb-8 p-5 mr-5">
          <h2 className="font-delicious mb-20">{post.title}</h2>
          {post.tags && post.tags.map((tag) => tag.name).join(', ')}
          <div className="mb-8 border-b border-bekk-night pb-1" />
          {readingTime(post.content?.toString() || "").text.replace("read", "")}
          <div className="mb-8 border-b border-bekk-night pb-1" />
          {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
          <div className="mb-8 border-b border-bekk-night pb-1" />
        </div>
        <div className="col-start-2 row-start-1 row-end-13 border-r-2 border-b border-bekk-night hidden md:block" />

        <div className='col-start-3 col-end-3 row-start-2 row-end-3 ml-5'>
          <div className='mb-8 flex justify-end'>
            <PostStamp />
          </div>
          <div className='hidden md:block'>
            {post.description && <PortableText value={post.description} />}
          </div>
        </div>
      </div>
    </div>
  )
}
