import { isAllowedEmbedHost } from 'utils/security'

import { TextLink } from '~/components/TextLink'

type IframeBlockProps = {
  iframe: { src?: string; height?: number }
}

export const IframeBlock = ({ iframe }: IframeBlockProps) => {
  let url: URL
  try {
    url = new URL(iframe.src ?? '')
  } catch {
    return null
  }
  if (url.protocol !== 'https:') {
    return null
  }

  // Verter som ikke er tillatt i CSP-en ville blitt blokkert, så vis en lenke i stedet
  if (!isAllowedEmbedHost(url.hostname)) {
    return (
      <p>
        <TextLink href={url.toString()}>Se innebygd innhold fra {url.hostname}</TextLink>
      </p>
    )
  }

  return (
    <iframe
      title={`Innebygd innhold fra ${url.hostname}`}
      src={url.toString()}
      height={iframe.height ?? 400}
      style={{ width: '100%' }}
      loading="lazy"
      allowFullScreen
    />
  )
}
