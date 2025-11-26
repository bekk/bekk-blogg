import { LinkTag } from '~/components/LinkTag'
import { LeftSideGiftsTeaser } from './svgs/LeftSideGiftsTeaser'
import { RightSideGiftsTeaser } from './svgs/RightSideGiftsTeaser'

export const TeaserPageFooter = () => {
  return (
    <>
      <div className="hidden md:flex justify-between items-end w-full max-w-[1800px]">
        <LeftSideGiftsTeaser />
        <RightSideGiftsTeaser />
      </div>
      <LinkTag linkText="Se tidligere julekalendere" url="/arkiv" className="md:hidden mb-12" />
    </>
  )
}
