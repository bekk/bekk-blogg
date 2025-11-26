import { Link } from 'react-router'
import { motion } from 'framer-motion'

import { trackEvent } from '../../../utils/analytics'
import { parseDate } from '../../../utils/date'
import { PostStamp } from './PostStamp'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'

interface RelatedPostsData {
  objectID: string
  name: string
  author: string[]
  tags: string[]
  slug?: string
  availableFrom?: string
  summary: string | null
  coverImage: POSTS_BY_YEAR_AND_DATEResult[number]['coverImage'] | null
}

export const RelatedPostsLayout = ({ items }: { items: RelatedPostsData[] }) => {
  console.log(items)
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
        {items.map((item) => {
          if (!item || !item.availableFrom) return null
          const date = parseDate(item.availableFrom)

          return (
            <Link
              to={`/post/${date.year}/${String(date.day).padStart(2, '0')}/${item.slug}`}
              key={item.objectID}
              onClick={() => trackEvent('related_post_clicked', { slug: item.slug ?? 'unknown' })}
            >
              <div className="relative w-[486px] h-[550px]">
                <svg
                  className="absolute"
                  width="487"
                  height="396"
                  viewBox="0 0 487 396"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 191.364L243.056 0L486.113 191.364V395.036H0V191.364Z" fill="#AEB7AB" />
                </svg>
                <div className="absolute top-[20px] ">
                  <RelatedPostcard item={item} />
                </div>

                <svg
                  className="absolute top-[192px]"
                  width="486"
                  height="316"
                  viewBox="0 0 486 316"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M244.182 197.765L2.28882e-05 0V315.636H485.831V0L244.182 197.765Z" fill="#32432D" />
                  <path
                    d="M480.486 315.636L244.182 197.765L275.408 211.83L485.831 312.26V315.636H480.486Z"
                    fill="#1F2F1B"
                  />
                  <path d="M5.6263 315.636L241.931 197.765L210.705 211.83L0 312.26V315.636H5.6263Z" fill="#1F2F1B" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const RelatedPostcard = ({ item }: { item: RelatedPostsData }) => {
  return (
    <div className="p-4">
      <motion.div
        className="striped-frame-small p-4 rounded-lg bg-postcard-beige flex flex-col h-full min-h-[400px]"
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        whileHover={{
          scale: 1.02,
          rotate: -0.5,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        }}
      >
        <div className="flex justify-between gap-10">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mt-2 mb-4">{item.name}</h3>
            <div className="text-base">
              <p>{new Intl.ListFormat('nb-NO', { type: 'conjunction', style: 'long' }).format(item.tags)}</p>
              <Border />
              <p>tid</p>
              <Border />
              <p>{new Intl.ListFormat('nb-NO', { type: 'conjunction', style: 'long' }).format(item.author)}</p>
              <Border />
            </div>
          </div>
          <PostStamp image={item.coverImage} />
        </div>
        {item.summary && <p className=" mt-4 text-base">{item.summary}</p>}
      </motion.div>
    </div>
  )
}

const Border = () => <div className="mb-1 border-b border-gray-300 pb-1" />
