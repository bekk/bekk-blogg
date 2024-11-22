import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

import { RelatedLinkElement } from '../../components/RelatedLink'

type RelatedLinksProps = {
  links: NonNullable<NonNullable<POST_BY_SLUGResult>['relatedLinks']>
}

export const RelatedLinks = ({ links }: RelatedLinksProps) => {
  return (
    <div>
      <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop" />
      <h3>Her er noen relevante ressurser som forfatteren anbefaler:</h3>
      {links.map((link) => (
        <RelatedLinkElement key={link._key} link={link} />
      ))}
    </div>
  )
}
