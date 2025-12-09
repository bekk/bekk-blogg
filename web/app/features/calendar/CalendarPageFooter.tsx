import { LinkTag } from '~/components/LinkTag'
import { GiftsLeftSideCalendar } from './giftsSVG/GiftsLeftSideCalendar'
import { GiftRightSideCalendar } from './giftsSVG/GiftRightSideCalendar'
import { useTextZoomScale } from '~/hooks/useTextZoomScale'

export const CalendarPageFooter = () => {
  const textZoomScale = useTextZoomScale()

  const leftGiftWidth = Math.round(644 * textZoomScale)
  const leftGiftHeight = Math.round(171 * textZoomScale)
  const rightGiftWidth = Math.round(312 * textZoomScale)
  const rightGiftHeight = Math.round(309 * textZoomScale)

  return (
    <>
      <div
        className={`hidden lg:flex ${textZoomScale > 1 ? 'mt-4' : 'absolute inset-x-0 bottom-0 z-10 pointer-events-none max-[1500px]:static max-[1500px]:z-auto max-[1500px]:pointer-events-auto max-[1500px]:mt-4'} `}
      >
        <div className="mx-auto max-w-[1800px] w-full">
          <div className="flex justify-between items-end z-10">
            <GiftsLeftSideCalendar width={leftGiftWidth} height={leftGiftHeight} />
            <GiftRightSideCalendar width={rightGiftWidth} height={rightGiftHeight} />
          </div>
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-8 items-center mt-8 pb-8">
        <LinkTag linkText="Se tidligere julekalendere" url="/arkiv" />
        <LinkTag linkText="Se kategorier" url="/kategori" />
      </div>
    </>
  )
}
