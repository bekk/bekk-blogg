import { AnimatePresence, motion } from 'framer-motion'
import { POSTS_BY_YEAR_AND_DATEResult } from 'utils/sanity/types/sanity.types'
import { SpinningText } from '~/components/SpinningText'

import { PostScreenPreview } from '~/features/post-preview/PostScreenPreview'
import { BekkLogo } from '../article/BekkLogo'
import { GiftRightSideArticle } from '../article/svgs/GiftRightSideArticle'
import { GiftsLeftSideArticle } from '../article/svgs/GiftsLeftSideArticle'
import { getPostUrl, qrColors } from './utils'
import { stableRandomIndex } from 'utils/random'

export const PortraitView = (posts: POSTS_BY_YEAR_AND_DATEResult, year: string, date: string, pageKey?: number) => {
  return (
    <div className="bg-soft-pink min-h-screen flex flex-col items-center justify-between overflow-hidden">
      <div className="flex flex-col items-center p-4 w-full">
        <div className="flex flex-row justify-between mb-20 w-full">
          <BekkLogo className="text-red-berry" />
          <h1 className="text-5xl text-red-berry text-center self-end m-0">Har du åpnet dagens luke?</h1>
          <SpinningText label="Bekk Christmas" className="text-red-berry font-gt-expanded">
            <div className="flex flex-col items-center font-bold">
              <span className="text-4xl leading-8">{date}</span>
              <span className="text-lg leading-4">des</span>
            </div>
          </SpinningText>
        </div>

        <AnimatePresence mode="popLayout">
          <div key={pageKey} className="flex flex-col gap-8 p-4 w-full items-center">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -400 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full flex flex-row justify-center"
              >
                <PostScreenPreview
                  qr={{
                    url: getPostUrl(post, year, date),
                    qrColors: qrColors[stableRandomIndex(post._id, qrColors.length)],
                  }}
                  {...post}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <div className="flex flex-row justify-between items-end w-full self-end">
        <div className="w-[150px]">
          <GiftsLeftSideArticle />
        </div>
        <div className="w-[150px] scale-x-[-1]">
          <GiftRightSideArticle />
        </div>
      </div>
    </div>
  )
}
