import { YearSVG } from '~/features/archive/svgs/YearSVG'

type YearBadgeProps = {
  year: number
}
export const YearBadge = ({ year }: YearBadgeProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <YearSVG />
      <div className="absolute flex items-center justify-center w-full h-full">{year}</div>
    </div>
  )
}
