import { LinkTag } from '~/components/LinkTag'
import { LeftSideGiftsTeaser } from './svgs/LeftSideGiftsTeaser'
import { RightSideGiftsTeaser } from './svgs/RightSideGiftsTeaser'

export const TeaserPageFooter = () => {
  return (
    <>
      <div className="hidden md:flex justify-between items-end max-w-[1800px] w-full">
        <LeftSideGiftsTeaser />
        <RightSideGiftsTeaser />
      </div>
      <LinkTag linkText="Se tidligere julekalendere" url="/arkiv" className="md:hidden mb-12" />
    </>
  )
}
