import { PortableText } from '@portabletext/react'
import { PortableText as PortableTextType } from 'utils/sanity/types/sanity.types'

import { components } from './Components'

export const InfoBlock = ({ content }: { content: PortableTextType }) => {
  return (
    <div className="rounded bg-envelope-beige px-4 pb-1 pt-4">
      <PortableText value={content} components={components} />
    </div>
  )
}
