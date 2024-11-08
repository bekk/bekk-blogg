import { PortableText } from '@portabletext/react'
import { PortableText as SanityPortableTextType } from 'utils/sanity/types/sanity.types'

import { components } from './Components'

export const InfoBlock = ({ content }: { content: SanityPortableTextType }) => {
  return (
    <div className="my-6 rounded bg-envelope-beige px-4 py-6">
      <PortableText value={content} components={components} />
    </div>
  )
}
