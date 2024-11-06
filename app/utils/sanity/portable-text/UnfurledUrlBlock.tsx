import { PreviewLink } from '@opengraphninja/react'
import '@opengraphninja/react/styles.css'
import { UnfurledUrl } from '../types/sanity.types'

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
