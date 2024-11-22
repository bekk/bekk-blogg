import { ImageWithMetadata } from '../../utils/sanity/types/sanity.types'
import { urlFor } from '../../utils/sanity/utils'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  const imageUrl = image?.asset ? urlFor(image.asset).auto('format').width(1700).quality(80).url() : image.src

  return (
    <figure style={{ maxWidth: image.maxWidth || '100%' }}>
      <img
        src={imageUrl}
        alt={image.alt || 'Image'}
        style={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: '20px',
        }}
      />

      <figcaption className="pt-1.5 md:pt-3 text-gray-500 text-xs md:text-sm">
        {(image.caption ? image.caption : '') +
          (image.src && !image.caption?.includes(image.src) ? ` ${image.caption ? '|' : ''} Kilde: ${image.src}` : '')}
      </figcaption>
    </figure>
  )
}
