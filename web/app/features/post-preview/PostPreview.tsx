import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import { readingTime } from 'utils/readingTime'
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
  link?: string
  type: string
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
  link,
  type,
}: PostPreviewProps) => {
  const showReadingTime = wordCount !== null || podcastLength !== null
  const content = (
    <motion.div
      className="striped-frame py-6 px-6 sm:p-7"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.02,
        rotate: -0.5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        },
      }}
    >
      <div className="grid sm:grid-cols-[1fr_1px_1fr] grid-cols-[30fr_1fr] w-full">
        <div className="col-start-1 col-end-1 row-start-2 row-end-2 sm:mr-7">
          {title && <h2 className="sm:mb-20">{title}</h2>}
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
          {showReadingTime && (
            <>
              {type == 'article' ? 'Artikkel' : type == 'podcast' ? 'Podkast' : 'Video'}{' '}
              {podcastLength ? ` (${podcastLength} min)` : wordCount ? ` (${readingTime(wordCount)})` : null}
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
      {summary && <p className="sm:hidden mt-2 text-sm line-clamp-3">{summary}</p>}
    </motion.div>
  )
  if (link) {
    return (
      <Link to={link} className="w-full max-w-4xl mx-auto px-2 md:px-0">
        {content}
      </Link>
    )
  }
  return <div className="w-full max-w-4xl mx-auto px-2 md:px-0">{content}</div>
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
        <PostPreview key={post._id} {...post} link={postUrl(post)} />
      ))}
    </div>
  )
}
