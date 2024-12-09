import { YearBadgeSVG } from '~/features/archive/svgs/YearBadgeSVG'

type YearBadgeProps = {
  year: number
}
export const YearBadge = ({ year }: YearBadgeProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <YearBadgeSVG />
      <div className="absolute flex items-center justify-center w-full h-full">{year}</div>
    </div>
  )
}
