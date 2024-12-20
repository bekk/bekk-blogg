import { useEffect, useState } from 'react'
import { SanityAsset } from '@sanity/image-url/lib/types/types'
import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'
import { urlFor } from 'utils/sanity/utils'

import { BekkLogo } from '~/features/article/BekkLogo'

type PostStampProps = {
  size?: string
  image?: NonNullable<POST_BY_SLUGResult>['coverImage'] | null
}

const useValidatedImageUrl = (image: NonNullable<POST_BY_SLUGResult>['coverImage'] | null): string | null => {
  const [validatedUrl, setValidatedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!image) return
    const validateUrl = async () => {
      const url = image?.asset
        ? urlFor(image.asset as SanityAsset)
            .height(450)
            .quality(50)
            .url()
        : image?.src

      if (!url) return

      const img = new Image()
      img.src = url
      img.onload = () => setValidatedUrl(url)
      img.onerror = () => setValidatedUrl(null)
    }

    validateUrl()
  }, [image])

  return validatedUrl
}

export const PostStamp = ({ size, image }: PostStampProps) => {
  const imageUrl = useValidatedImageUrl(image ?? null)

  return (
    <div className={`relative ${size ? size : 'h-21.4 w-16 md:h-[107px] md:w-[80px]'}`}>
      <StampSvg imgUrl={imageUrl} size={size} />
      <div className="absolute inset-0 flex items-center justify-center">
        {!imageUrl && <BekkLogo className="size-1/2" />}
      </div>
    </div>
  )
}

const StampSvg = ({ size, imgUrl }: { size?: string; imgUrl?: string | null }) => {
  const imageId = toBase64Unicode(imgUrl ?? '')

  return (
    <svg
      className={`${size ? size : 'h-21.4 w-16 md:h-[107px] md:w-[80px]'}`}
      viewBox="0 0 160 214"
      fill="#2F7346"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_35_1034)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M148 0H156C156 2.20914 157.791 4 160 4V12.45C157.791 12.45 156 14.2409 156 16.45C156 18.6591 157.791 20.45 160 20.45V28.9C157.791 28.9 156 30.6909 156 32.9C156 35.1091 157.791 36.9 160 36.9V45.35C157.791 45.35 156 47.1409 156 49.35C156 51.5591 157.791 53.35 160 53.35V61.8C157.791 61.8 156 63.5908 156 65.8C156 68.0091 157.791 69.8 160 69.8V78.25C157.791 78.25 156 80.0409 156 82.25C156 84.4591 157.791 86.25 160 86.25V94.7C157.791 94.7 156 96.4909 156 98.7C156 100.909 157.791 102.7 160 102.7V111.15C157.791 111.15 156 112.941 156 115.15C156 117.359 157.791 119.15 160 119.15V127.6C157.791 127.6 156 129.391 156 131.6C156 133.809 157.791 135.6 160 135.6V144.05C157.791 144.05 156 145.841 156 148.05C156 150.259 157.791 152.05 160 152.05V160.5C157.791 160.5 156 162.291 156 164.5C156 166.709 157.791 168.5 160 168.5V176.95C157.791 176.95 156 178.741 156 180.95C156 183.159 157.791 184.95 160 184.95V193.4C157.791 193.4 156 195.191 156 197.4C156 199.609 157.791 201.4 160 201.4V210C157.791 210 156 211.791 156 214H148C148 211.791 146.209 210 144 210C141.791 210 140 211.791 140 214H132C132 211.791 130.209 210 128 210C125.791 210 124 211.791 124 214H116C116 211.791 114.209 210 112 210C109.791 210 108 211.791 108 214H100C100 211.791 98.2091 210 96 210C93.7909 210 92 211.791 92 214H84C84 211.791 82.2091 210 80 210C77.7909 210 76 211.791 76 214H68C68 211.791 66.2091 210 64 210C61.7909 210 60 211.791 60 214H52C52 211.791 50.2091 210 48 210C45.7909 210 44 211.791 44 214H36C36 211.791 34.2091 210 32 210C29.7909 210 28 211.791 28 214H20C20 211.791 18.2091 210 16 210C13.7909 210 12 211.791 12 214H4C4 211.791 2.20914 210 0 210V201.4C2.20914 201.4 4 199.609 4 197.4C4 195.191 2.20914 193.4 0 193.4V184.95C2.20914 184.95 4 183.159 4 180.95C4 178.741 2.20914 176.95 0 176.95V168.5C2.20914 168.5 4 166.709 4 164.5C4 162.291 2.20914 160.5 0 160.5V152.05C2.20914 152.05 4 150.259 4 148.05C4 145.841 2.20914 144.05 0 144.05V135.6C2.20914 135.6 4 133.809 4 131.6C4 129.391 2.20914 127.6 0 127.6V119.15C2.20914 119.15 4 117.359 4 115.15C4 112.941 2.20914 111.15 0 111.15V102.7C2.20914 102.7 4 100.909 4 98.7C4 96.4909 2.20914 94.7 0 94.7V86.25C2.20914 86.25 4 84.4591 4 82.25C4 80.0409 2.20914 78.25 0 78.25V69.8C2.20914 69.8 4 68.0091 4 65.8C4 63.5908 2.20914 61.8 0 61.8V53.35C2.20914 53.35 4 51.5591 4 49.35C4 47.1409 2.20914 45.35 0 45.35V36.9C2.20914 36.9 4 35.1091 4 32.9C4 30.6909 2.20914 28.9 0 28.9V20.45C2.20914 20.45 4 18.6591 4 16.45C4 14.2409 2.20914 12.45 0 12.45V4C2.20914 4 4 2.20914 4 0H12C12 2.20914 13.7909 4 16 4C18.2091 4 20 2.20914 20 0H28C28 2.20914 29.7909 4 32 4C34.2091 4 36 2.20914 36 0H44C44 2.20914 45.7909 4 48 4C50.2091 4 52 2.20914 52 0H60C60 2.20914 61.7909 4 64 4C66.2091 4 68 2.20914 68 0H76C76 2.20914 77.7909 4 80 4C82.2091 4 84 2.20914 84 0H92C92 2.20914 93.7909 4 96 4C98.2091 4 100 2.20914 100 0H108C108 2.20914 109.791 4 112 4C114.209 4 116 2.20914 116 0H124C124 2.20914 125.791 4 128 4C130.209 4 132 2.20914 132 0H140C140 2.20914 141.791 4 144 4C146.209 4 148 2.20914 148 0Z"
          fill={imgUrl ? `url(#${imageId})` : ''}
        />
      </g>
      <defs>
        {imgUrl && (
          <pattern id={imageId} width="100%" height="100%">
            <image href={imgUrl} height="100%" width="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
        <clipPath id="clip0_35_1034">
          <rect width="160" height="214" />
        </clipPath>
      </defs>
    </svg>
  )
}
const toBase64Unicode = (input: string) => {
  const utf8Bytes = new TextEncoder().encode(input)
  return btoa(String.fromCharCode(...utf8Bytes))
}
