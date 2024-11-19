import { RelatedLink } from 'utils/sanity/types/sanity.types'

import { RelatedLinkElement } from '../../components/RelatedLink'

type RelatedLinksProps = {
  links: RelatedLink[]
}

export const RelatedLinks = ({ links }: RelatedLinksProps) => {
  return (
    <div>
      <div className="mb-4 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop" />
      <h3>Her er noen relevante artikler som forfatteren anbefaler:</h3>
      {links.map((link) => {
        return <RelatedLinkElement key={link._key} link={link} />
      })}
    </div>
  )
}
