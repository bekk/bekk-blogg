import { ImageWithMetadata } from '../../utils/sanity/types/sanity.types'
import { urlFor } from '../../utils/sanity/utils'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  const imageUrl = image?.asset ? urlFor(image.asset).width(1700).quality(80).url() : image.src

  const aspectRatio = image?.asset?.metadata
    ? (parseInt(image.asset.metadata.dimensions.width) / parseInt(image.asset.metadata.dimensions.height)).toString()
    : ''

  return (
    <figure style={{ maxWidth: image.maxWidth || '100%', aspectRatio: aspectRatio }}>
      <img
        src={imageUrl}
        alt={image.alt || 'Image'}
        style={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: '20px',
          aspectRatio: aspectRatio,
        }}
      />

      <figcaption className="pt-1.5 md:pt-3 text-gray-500 text-xs md:text-sm">
        {(image.caption ? image.caption : '') +
          (image.src && !image.caption?.includes(image.src) ? ` ${image.caption ? '|' : ''} Kilde: ${image.src}` : '')}
      </figcaption>
    </figure>
  )
}
