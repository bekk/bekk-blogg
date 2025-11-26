import { readingTime } from 'utils/readingTime'
import { QRCodeSVG } from 'qrcode.react'
import { StampBorder } from '../StampBorder'

interface PostScreenPreviewProps {
  title: string | null
  qr: {
    url: string
    qrColors: { bg: string; fg: string }
  }
  tags: string[] | null
  authors: string[] | null
  wordCount: number | null
  podcastLength: number | null
  type: string
}

export const PostScreenPreview = ({
  title,
  qr,
  tags,
  authors,
  wordCount,
  podcastLength,
  type,
}: PostScreenPreviewProps) => {
  const showReadingTime = wordCount !== null || podcastLength !== null

  return (
    <div className="w-full h-full striped-frame p-8 max-w-[800px] flex flex-col">
      <div className="flex flex-row justify-between gap-8 mb-4">
        {title && <h2 className="line-clamp-2 m-0 text-2xl h-fit">{title}</h2>}
        <StampBorder
          background={qr.qrColors.bg}
          borderColor={qr.qrColors.bg}
          borderThickness="4px"
          borderRadius="2px"
          borderRotation="3px"
        >
          <QRCodeSVG
            className="flex-[0_0_auto] p-2"
            value={qr.url}
            size={90}
            bgColor={qr.qrColors.bg}
            fgColor={qr.qrColors.fg}
          />
        </StampBorder>
      </div>
      <div className="text-sm">
        {tags && (
          <>
            {tags.join(', ')}
            <div className="border-b border-bekk-night pb-1 mb-3" />
          </>
        )}
        {showReadingTime && (
          <>
            {type == 'article' ? 'Artikkel' : type == 'podcast' ? 'Podkast' : 'Video'}{' '}
            {podcastLength ? ` (${podcastLength} min)` : wordCount ? ` (${readingTime(wordCount)})` : null}
            <div className="border-b border-bekk-night pb-1 mb-3" />
          </>
        )}
        {authors && `Fra ${authors.join(', ')}`}
        <div className="border-b border-bekk-night pb-1 mb-3" />
      </div>
    </div>
  )
}
