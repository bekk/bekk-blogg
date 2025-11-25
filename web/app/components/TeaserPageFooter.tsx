import { BigParcel } from './BigParcel'
import { GiftsWithLink } from './GiftsWithLink'

interface TeaserPageFooterProps {
  className?: string
}

export const TeaserPageFooter = ({ className }: TeaserPageFooterProps) => {
  return (
    <div className={`w-full px-16 pb-0 gap-24 flex flex-row items-end bg-soft-pink bottom-0 ${className}`}>
      <BigParcel />
      <GiftsWithLink />
    </div>
  )
}
