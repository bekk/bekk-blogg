import { PortableText } from './sanity/types/sanity.types'
import { toPlainText } from './sanity/utils'

export const readingTime = (post: PortableText | undefined) => {
  const averageWPM = 600
  const text = toPlainText(post)

  const adjustedText = text.replace(/(.)\1+/g, '$1')

  const adjustedSentences = adjustedText.replace(/([.!?])\s*\1+/g, '$1')

  const adjustedCharCount = adjustedSentences.length

  const adjustedWords = adjustedSentences.trim().split(/\s+/)
  const adjustedWordCount = adjustedWords.length
  const averageWordLength = adjustedCharCount / adjustedWordCount

  const adjustedTime = (adjustedCharCount / averageWPM) * (averageWordLength / 5)

  const formattedAdjustedTime = adjustedTime > 1 ? Math.round(adjustedTime) + ' min' : 'Mindre enn 1 min'

  return formattedAdjustedTime
}
