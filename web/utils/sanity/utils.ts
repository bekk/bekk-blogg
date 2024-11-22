/** Turns portable text into a string
 *
 * Borrowed from https://www.sanity.io/docs/presenting-block-text#ac67a867dd69
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export function toPlainText(blocks: any[] = []) {
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

        return block.children.map((child: any) => child.text).join('')
      })
      // join the paragraphs leaving split by two linebreaks
      .join('\n\n')
  )
}

const projectId = typeof process === 'undefined' ? window?.ENV?.SANITY_STUDIO_PROJECT_ID : process.env.SANITY_PROJECT_ID
const dataset = typeof process === 'undefined' ? window?.ENV?.SANITY_STUDIO_DATASET : process.env.SANITY_DATASET

const builder = imageUrlBuilder({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
})

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format').quality(80).width(850)
