import { SanityImageSource } from '@sanity/image-url'
import type { ImageWithMetadata, SanityImageAsset } from '../../utils/sanity/types/sanity.types'
import { urlFor } from '../../utils/sanity/utils'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata | null
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  if (!image) {
    return null
  }

  // If we have a direct src URL, use it without srcset
  if (!image.asset && image.src) {
    return (
      <figure style={{ maxWidth: image.maxWidth || '100%' }}>
        <img
          src={image.src}
          alt={image.alt || ''}
          style={{
            width: '100%',
            objectFit: 'cover',
            borderRadius: '20px',
          }}
        />
        {renderCaption(image)}
      </figure>
    )
  }

  // For Sanity assets, create responsive srcset
  if (image.asset) {
    const asset = image.asset as unknown as SanityImageAsset
    const metadata = asset?.metadata
    const aspectRatio = metadata?.dimensions?.aspectRatio

    const imageSizes = [400, 800, 1200, 1700]
    const srcSet = imageSizes
      .map((width) => {
        const url = urlFor(image.asset as SanityImageSource)
          .width(width)
          .quality(80)
          .url()
        return `${url} ${width}w`
      })
      .join(', ')

    return (
      <figure style={{ maxWidth: image.maxWidth || '100%', aspectRatio, display: 'inline-block' }}>
        <img
          src={urlFor(image.asset).width(1700).quality(80).url()}
          srcSet={srcSet}
          sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1700px"
          alt={image.alt || ''}
          style={{
            width: '100%',
            objectFit: 'cover',
            borderRadius: '20px',
            aspectRatio: aspectRatio,
          }}
        />
        {renderCaption(image)}
      </figure>
    )
  }

  return null
}

function renderCaption(image: ImageWithMetadata) {
  if (!image.caption) return null

  return (
    <figcaption className="pt-1.5 md:pt-3 text-gray-700 text-xs md:text-sm">
      {(image.caption ? image.caption : '') +
        (image.src && !image.caption?.includes(image.src) ? ` ${image.caption ? '|' : ''} Kilde: ${image.src}` : '')}
    </figcaption>
  )
}
