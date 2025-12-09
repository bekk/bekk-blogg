/** Turns portable text into a string
 *
 * Borrowed from https://www.sanity.io/docs/presenting-block-text#ac67a867dd69
 */
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url'
import { DescriptionText } from './types/sanity.types'

export function toPlainText(blocks: DescriptionText | null = []) {
  if (!blocks || !blocks.length) {
    return ''
  }
  return (
    blocks
      // loop through each block
      .map((block) => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the
        // text strings

        return block.children.map((child) => child.text).join('')
      })
      // join the paragraphs leaving split by two linebreaks
      .join('\n\n')
  )
}

const projectId =
  typeof process === 'undefined' ? window?.ENV?.SANITY_STUDIO_PROJECT_ID : process.env.SANITY_STUDIO_PROJECT_ID
const dataset = typeof process === 'undefined' ? window?.ENV?.SANITY_STUDIO_DATASET : process.env.SANITY_STUDIO_DATASET

const builder = createImageUrlBuilder({
  projectId: projectId ?? 'ah2n1vfr',
  dataset: dataset ?? 'bekk-blogg-prod',
})

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format')
