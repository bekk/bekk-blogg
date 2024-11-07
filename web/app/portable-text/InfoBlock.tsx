import { PortableText } from '@portabletext/react'
import { PortableText as SanityPortableTextType } from 'utils/sanity/types/sanity.types'

import { components } from './Components'

export const InfoBlock = ({ content }: { content: SanityPortableTextType }) => {
  return content ? (
    <div className="px-4 py-6 my-6 bg-envelope-beige rounded">
      <PortableText value={content} components={components} />
    </div>
  ) : (
    <div>Infoblock content missing</div>
  )
}
