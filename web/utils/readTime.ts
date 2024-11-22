import { PortableText } from './sanity/types/sanity.types'
import { toPlainText } from './sanity/utils'

export const readingTime = (post: PortableText | undefined) => {
  const averageWPM = 150
  const text = toPlainText(post)
  const regex = /[A-Za-z']+/gm

  const matches = [...text.matchAll(regex)]

  const adjustedTime = matches.length / averageWPM

  const formattedAdjustedTime = adjustedTime > 1 ? Math.round(adjustedTime) + ' min' : 'Mindre enn 1 min'

  return formattedAdjustedTime
}
