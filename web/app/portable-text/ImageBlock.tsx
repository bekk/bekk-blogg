import { useEffect, useState } from 'react'

import { ImageWithMetadata } from '../../utils/sanity/types/sanity.types'

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata
}

export default function ImageBlock({ image }: ImageWithMetadataDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  // Generate the URL with optional crop/hotspot using urlFor
  useEffect(() => {
    if (!image.asset && image.src) {
      setImageUrl(image.src)
      return
    }
    fetch('/api/image-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asset: image.asset }),
    })
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.imageUrl)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [image.asset, image.src])

  return (
    <figure style={{ maxWidth: image.maxWidth || '100%' }}>
      <img
        src={imageUrl}
        alt={image.alt || 'Image'}
        style={{
          width: '100%',
          objectFit: 'cover',
        }}
      />

      <figcaption className="pt-3 text-gray-500 max-sm:text-sm">
        {(image.caption ? image.caption : '') +
          (image.src && !image.caption?.includes(image.src) ? ` ${image.caption ? '|' : ''} Kilde: ${image.src}` : '')}
      </figcaption>
    </figure>
  )
}
