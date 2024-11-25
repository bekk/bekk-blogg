import { Link } from '@remix-run/react'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'

import { PostStamp } from '../article/PostStamp'

import { postUrl } from '~/lib/format'

type PostPreviewType = {
  _id: string
  title: string | null
  slug: { current?: string | null } | null
  coverImage: POSTS_BY_YEAR_AND_DATEResult[number]['coverImage'] | null // TODO: Rename the type
  tags: string[] | null
  authors: string[] | null
  summary: string | null
  wordCount: number | null
  podcastLength: number | null
}

type PostPreviewProps = PostPreviewType

export const PostPreview = ({
  title,
  coverImage,
  tags,
  authors,
  summary,
  wordCount,
  podcastLength,
}: PostPreviewProps) => {
  const showReadTime = wordCount !== null && podcastLength === null
  return (
    <div className="striped-frame min-w-full py-6 px-6 sm:p-7">
      <div className="grid  max-w-4xl sm:grid-cols-[1fr_1px_1fr] grid-cols-[30fr_1fr]">
        <div className="col-start-1 col-end-1 row-start-2 row-end-2 sm:mr-7">
          {title && <h2 className="font-delicious sm:mb-20">{title}</h2>}
        </div>
        <div className="col-start-2 row-start-1 row-end-4 hidden border-r border-bekk-night sm:block" />
        <div className="flex justify-end ml-1 sm:mb-9 col-start-3 col-end-3 row-start-2 row-end-3 sm:ml-7">
          <PostStamp image={coverImage} size={'h-16,05 w-12 sm:h-21,4 sm:w-16 sm:h-[107px] sm:w-[80px]'} />
        </div>
        <div className="text-sm sm:text-lg col-start-1 col-end-1 row-start-3 row-end-3 sm:mr-7">
          {tags && (
            <>
              {tags.join(', ')}
              <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" />
            </>
          )}
          {showReadTime && (
            <>
              {podcastLength ? `${podcastLength} min` : wordCount ? readingTime(wordCount) : null}
              <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" />
            </>
          )}
          {authors && `Fra ${authors.join(', ')}`}
          <div className="sm:mb-7 border-b border-bekk-night pb-1 mb-3" />
        </div>
        {summary && (
          <div className="hidden sm:text-lg sm:block col-start-3 col-end-3 row-start-3 row-end-3 sm:ml-7">
            <p className="line-clamp-6">{summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// TODO: Refactor out to somewhere else
const readingTime = (wordCount: number) => {
  return `${Math.ceil(wordCount / 250)} min`
}

export type PostPreviewListProps = {
  posts: PostPreviewType[]
}

export const PostPreviewList = ({ posts }: PostPreviewListProps) => {
  if (!posts.length) {
    return <p>Ingen innlegg funnet</p>
  }
  return (
    <div className="flex flex-col max-sm:w-full gap-8 md:gap-12">
      {posts.map((post) => (
        <Link key={post._id} to={postUrl(post)} className="mx-4 flex justify-center">
          <PostPreview {...post} />
        </Link>
      ))}
    </div>
  )
}
