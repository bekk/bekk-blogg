import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'

import { RelatedLinkElement } from '~/components/RelatedLink'

type RelatedLinksProps = {
  links: NonNullable<NonNullable<POST_BY_SLUGResult>['relatedLinks']>
  language: NonNullable<POST_BY_SLUGResult>['language']
}

export const RelatedLinks = ({ links, language }: RelatedLinksProps) => {
  return (
    <div>
      <div className="mb-8 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop" />
      <h3>
        {language === 'en-US'
          ? 'Relevant resources recommended by the author'
          : 'Relevante lenker anbefalt av forfatteren'}
      </h3>
      {links.map((link) => (
        <RelatedLinkElement key={link._key} link={link} language={language} />
      ))}
    </div>
  )
}
