import { Link } from 'react-router'
import { motion } from 'framer-motion'

import { trackEvent } from '../../../utils/analytics'
import { parseDate } from '../../../utils/date'
import { PostStamp } from './PostStamp'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'
import { readingTime } from 'utils/readingTime'

interface RelatedPostsData {
  objectID: string
  name: string
  author: string[]
  tags: string[]
  slug?: string
  availableFrom?: string
  summary: string | null
  coverImage: POSTS_BY_YEAR_AND_DATEResult[number]['coverImage'] | null
  podcastLength: number | null
  wordCount: number | null
}

export const RelatedPostsLayout = ({ items }: { items: RelatedPostsData[] }) => {
  const isSmallScreen = window.innerWidth <= 640
  const isMediumScreen = window.innerWidth <= 768
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 md:gap-y-24 md:gap-x-16">
        {items.map((item) => {
          if (!item || !item.availableFrom) return null
          const date = parseDate(item.availableFrom)

          return (
            <Link
              to={`/post/${date.year}/${String(date.day).padStart(2, '0')}/${item.slug}`}
              key={item.objectID}
              onClick={() => trackEvent('related_post_clicked', { slug: item.slug ?? 'unknown' })}
              aria-label={`Les mer om ${item.name}`}
            >
              <motion.div
                className="relative sm:w-[400px] sm:h-[453px] w-[300px] h-[340px]"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <svg
                  className="absolute"
                  width={isSmallScreen ? '300' : '400'}
                  height={isSmallScreen ? '244' : '326'}
                  viewBox="0 0 487 396"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 191.364L243.056 0L486.113 191.364V395.036H0V191.364Z" fill="#AEB7AB" />
                </svg>
                <motion.div
                  className="absolute top-[20px] w-full"
                  variants={{
                    rest: { y: 0 },
                    hover: {
                      y: isMediumScreen ? -50 : -100,
                      transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                      },
                    },
                  }}
                >
                  <RelatedPostcard item={item} />
                </motion.div>
                <svg
                  className="absolute top-[118px] sm:top-[158px]"
                  width={isSmallScreen ? '300' : '400'}
                  height={isSmallScreen ? '196' : '261'}
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
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const RelatedPostcard = ({ item }: { item: RelatedPostsData }) => {
  const getTimeLength = () => {
    let time: string = ''
    if (item.podcastLength) {
      time = `${item.podcastLength}`
    } else if (item.wordCount) {
      time = readingTime(item.wordCount)
    }
    return time
  }

  return (
    <div className="p-4">
      <div className="striped-frame-small p-4 rounded-lg bg-postcard-beige flex flex-col h-full sm:min-h-[300px] sm:max-h-[370px] max-h-[260px]  overflow-hidden">
        <div className="flex justify-between gap-[0.5rem] sm:gap-8">
          <div className="flex flex-col h-full">
            <h3 className="text-base sm:text-lg font-semibold mt-2 mb-4">{item.name}</h3>
            <div className="text-xs sm:text-base">
              <p>{new Intl.ListFormat('nb-NO', { type: 'conjunction', style: 'long' }).format(item.tags)}</p>
              <Border />
              {getTimeLength() && (
                <>
                  <p>{getTimeLength()}</p>
                  <Border />
                </>
              )}
              <p>{new Intl.ListFormat('nb-NO', { type: 'conjunction', style: 'long' }).format(item.author)}</p>
              <Border />
            </div>
          </div>
          <PostStamp image={item.coverImage} size=" w-[3rem] h-[64.2px]  sm:h-21.4 sm:w-16" />
        </div>
        {item.summary && <p className=" mt-4 text-xs sm:text-base">{item.summary}</p>}
      </div>
    </div>
  )
}

const Border = () => <div className="mb-1 border-b border-gray-300 pb-1" />
