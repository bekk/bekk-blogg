import { Link } from '@remix-run/react'

type DayNavigationProps = {
  day: number
  year: number
}
export const DayNavigation = ({ day, year }: DayNavigationProps) => {
  const today = new Date()
  const targetDate = new Date(year, 11, day + 1)
  const canShowNextDay = targetDate >= today

  return (
    <div className="flex justify-center gap-4 my-8">
      {day > 1 && (
        <Link
          to={`/post/${year}/${String(day - 1).padStart(2, '0')}`}
          prefetch="intent"
          className="group text-bekk-night hover:text-reindeer-brown styled-box-navigation px-4 py-1"
        >
          <span className="group-hover:-translate-x-1 group-hover:transition-all inline-block ">&larr;</span> {day - 1}.
          desember
        </Link>
      )}
      {day < 24 && canShowNextDay && (
        <Link
          to={`/post/${year}/${String(day + 1).padStart(2, '0')}`}
          prefetch="intent"
          className="group text-bekk-night hover:text-reindeer-brown styled-box-navigation px-4 py-1"
        >
          {day + 1}. desember{' '}
          <span className="group-hover:translate-x-1 group-hover:transition-all inline-block">&rarr;</span>
        </Link>
      )}
    </div>
  )
}
