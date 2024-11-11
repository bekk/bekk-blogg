import { Post } from '../../../utils/sanity/types/sanity.types'

type LetterProps = {
  post: Post
}
export const Letter = ({ post }: LetterProps) => {
  return (
    <div className="striped-frame w-10/12 p-3 md:p-8">
      <h2 className="font-delicious">{post.title}</h2>
      <div className="mb-8 border-b border-bekk-night pb-1" />
      {post.tags && post.tags.map((tag) => tag.name).join(', ')}
      <div className="mb-8 border-b border-bekk-night pb-1" />
      {post.authors && `Fra ${post.authors.map((author) => author.fullName).join(', ')}`}
      <div className="mb-8 border-b border-bekk-night pb-1" />
    </div>
  )
}