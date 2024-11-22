import { PortableText } from './sanity/types/sanity.types'
import { toPlainText } from './sanity/utils'

export const readingTime = (post: PortableText | undefined) => {
  const averageWPM = 130
  const text = toPlainText(post)
  const regex = /[A-Za-z']+/gm
  const adjustedText = text
    .replace(/<[^>]*>/gi, ' ')
    .replace(/<\/[^>]*>/gi, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF\u2000-\u200F\u2028-\u202F]/g, '')
    .replace(/\s+/gi, ' ')
    .trim()

  const matches = [...adjustedText.matchAll(regex)]

  const adjustedTime = matches.length / averageWPM

  const formattedAdjustedTime = adjustedTime > 1 ? Math.round(adjustedTime) + ' min' : 'Mindre enn 1 min'

  return formattedAdjustedTime
}
