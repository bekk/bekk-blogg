import { Link } from '@remix-run/react'

import { POST_BY_SLUGResult } from '../../../utils/sanity/types/sanity.types'

import { Letter } from '~/features/letters/Letter'
import { postUrl } from '~/lib/format'

type LetterDisplayerProps = {
  posts: POST_BY_SLUGResult[]
  error?: string
}
export const LetterDisplayer = ({ posts, error }: LetterDisplayerProps) => {
  return (
    <div className="flex flex-col items-center gap-8 mb-4 md:mb-12 md:gap-12">
      <div className="flex flex-col max-sm:w-full gap-8 md:gap-12">
        {posts.length === 0 && <h2>{error}</h2>}
        {posts.map((post) => {
          if (!post) {
            return null
          }
          return (
            <Link className="mx-4 flex justify-center" to={postUrl(post)} key={post._id}>
              <Letter key={post._id} post={post} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
