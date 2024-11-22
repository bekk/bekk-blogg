import type { ImageWithMetadata, SanityImageAsset } from '../../utils/sanity/types/sanity.types'
import { urlFor } from '../../utils/sanity/utils'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata | null
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  if (!image) {
    return null
  }
  const imageUrl = image.asset ? urlFor(image.asset).width(1700).quality(80).url() : image.src
  const asset = image.asset as unknown as SanityImageAsset
  const metadata = asset?.metadata

  const aspectRatio = metadata?.dimensions?.aspectRatio

  if (!imageUrl) {
    return null
  }

  return (
    <figure style={{ maxWidth: image.maxWidth || '100%', aspectRatio }}>
      <img
        src={imageUrl}
        alt={image.alt || ''}
        style={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: '20px',
          aspectRatio: aspectRatio,
        }}
      />
      {image.caption && (
        <figcaption className="pt-1.5 md:pt-3 text-gray-500 text-xs md:text-sm">
          {(image.caption ? image.caption : '') +
            (image.src && !image.caption?.includes(image.src)
              ? ` ${image.caption ? '|' : ''} Kilde: ${image.src}`
              : '')}
        </figcaption>
      )}
    </figure>
  )
}
