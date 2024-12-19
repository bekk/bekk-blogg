import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'

import { trackEvent } from '../../../utils/analytics'
import { parseDate } from '../../../utils/date'

interface RelatedPostsData {
  objectID: string
  name: string
  author: string[]
  tags: string[]
  slug?: string
  availableFrom?: string
}

export const RelatedPostsLayout = ({ items }: { items: RelatedPostsData[] }) => {
  return (
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
            <motion.div
              className="striped-frame-small p-4 rounded-lg bg-postcard-beige flex flex-col h-full justify-between"
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
              <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
              <div>
                <p className="text-sm">
                  {new Intl.ListFormat('nb-NO', { type: 'conjunction', style: 'long' }).format(item.author)}
                </p>
                <p className="text-sm text-gray-500">
                  {date.day}. desember, {date.year}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
