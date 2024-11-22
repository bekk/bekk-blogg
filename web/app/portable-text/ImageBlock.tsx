import { useEffect, useState } from 'react'

import { ImageWithMetadata } from '../../utils/sanity/types/sanity.types'
import { urlFor } from '../../utils/sanity/utils'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (image?.asset) {
      setImageUrl(urlFor(image.asset).url())
    } else {
      setImageUrl(image?.src)
    }
  }, [image])

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
