import {useEffect, useState} from "react";

import {ImageWithMetadata} from "../types/sanity.types";

type ImageWithMetadataDisplayProps = {
  image: ImageWithMetadata;
};

export default function ImageWithMetadataBlock({ image }: ImageWithMetadataDisplayProps) {
  const [imageUrl, setImageUrl] = useState(undefined)

  // Generate the URL with optional crop/hotspot using urlFor
  useEffect(() => {
    fetch('/api/image-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({asset: image.asset}),
    }).then((res) => res.json()).then((data) => {
      setImageUrl(data.imageUrl)
    }).catch((error) => {
      console.error('Error:', error);
    });
  }, [image.asset]);


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
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}