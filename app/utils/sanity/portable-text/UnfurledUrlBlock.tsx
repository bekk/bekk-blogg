import { PreviewLink } from '@opengraphninja/react'

import { UnfurledUrl } from '../types/sanity.types'

import '@opengraphninja/react/styles.css'

type UnfurledUrlBlockProps = {
  unfurledUrl: UnfurledUrl
}

export const UnfurledUrlBlock = ({ unfurledUrl }: UnfurledUrlBlockProps) => {
  if (!unfurledUrl || !unfurledUrl.url) {
    return null
  }
  return (
    <div>
      <PreviewLink href={unfurledUrl.url} />
    </div>
  )
}
