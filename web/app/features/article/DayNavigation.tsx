import { Link } from '@remix-run/react'

type DayNavigationProps = {
  day: number
  year: number
}
export const DayNavigation = ({ day, year }: DayNavigationProps) => {
  return (
    <div className="flex justify-center gap-4">
      {day > 1 && (
        <Link to={`/${year}/${day - 1}`} prefetch="intent" className="text-bekk-night hover:underline">
          &larr; {day - 1}. desember
        </Link>
      )}
      {day < 24 && (
        <Link to={`/${year}/${day + 1}`} prefetch="intent" className="text-bekk-night hover:underline">
          {day + 1}. desember &rarr;
        </Link>
      )}
    </div>
  )
}
