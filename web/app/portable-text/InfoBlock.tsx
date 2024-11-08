import { PortableText } from '@portabletext/react'
import { PortableText as SanityPortableTextType } from 'utils/sanity/types/sanity.types'

import { components } from './Components'

export const InfoBlock = ({ content }: { content: SanityPortableTextType }) => {
  return (
    <div className="px-4 pt-4 pb-1 bg-envelope-beige rounded">
      <PortableText value={content} components={components} />
    </div>
  )
}
