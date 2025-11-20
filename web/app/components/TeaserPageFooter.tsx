import { BigParcel } from './BigParcel'
import { GiftsWithLink } from './GiftsWithLink'

interface TeaserPageFooterProps {
  className?: string
}

export const TeaserPageFooter = ({ className }: TeaserPageFooterProps) => {
  return (
    <div className={`w-full mt-12 px-16 gap-24 flex-row items-end ${className}`}>
      <BigParcel />
      <GiftsWithLink />
    </div>
  )
}
