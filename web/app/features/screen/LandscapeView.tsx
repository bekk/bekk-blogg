import { AnimatePresence, motion } from 'framer-motion'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'

import { PostScreenPreview } from '~/features/post-preview/PostScreenPreview'
import { getPostUrl, qrColors } from './utils'

export const LandscapeView = (posts: POSTS_BY_YEAR_AND_DATEResult, year: string, date: string, pageKey?: number) => {
  return (
    <div className="bg-mid-green min-h-screen flex flex-col items-center gap-16 overflow-hidden p-4 pt-16">
      <h1 className="text-5xl text-soft-pink text-center m-0">{date}. desember</h1>

      <AnimatePresence mode="popLayout">
        <div key={pageKey} className="grid grid-cols-3 gap-8 p-4 h-full items-stretch auto-rows-fr">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -400 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="h-full flex flex-col"
            >
              <PostScreenPreview
                qr={{ url: getPostUrl(post, year, date), qrColors: qrColors[index % qrColors.length] }}
                {...post}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
