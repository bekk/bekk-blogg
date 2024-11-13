/** Turns portable text into a string
 *
 * Borrowed from https://www.sanity.io/docs/presenting-block-text#ac67a867dd69
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
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
