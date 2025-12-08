import { Link } from 'react-router'

type DayNavigationProps = {
  day: number
  year: number
}
export const DayNavigation = ({ day, year }: DayNavigationProps) => {
  const today = new Date()
  const nextDate = new Date(year, 11, day + 1)
  const canShowNextDay = nextDate <= today

  return (
    <div className="flex justify-center gap-4 my-8">
      {day > 1 && (
        <div className="rounded-lg inline-block focus-within:ring- focus-within:ring-red-berry">
          <Link
            to={`/post/${year}/${String(day - 1).padStart(2, '0')}`}
            prefetch="intent"
            className="group text-bekk-night hover:text-reindeer-brown styled-box-navigation px-4 py-1"
            aria-label={`Gå til ${day - 1}. desember`}
          >
            <span className="group-hover:-translate-x-1 group-hover:transition-all inline-block ">&larr;</span>{' '}
            {day - 1}. desember
          </Link>
        </div>
      )}
      {day < 24 && canShowNextDay && (
        <div className="rounded-lg inline-block focus-within:ring-1 focus-within:ring-red-berry">
          <Link
            to={`/post/${year}/${String(day + 1).padStart(2, '0')}`}
            prefetch="intent"
            className="group text-bekk-night hover:text-reindeer-brown styled-box-navigation px-4 py-1"
            aria-label={`Gå til ${day + 1}. desember`}
          >
            {day + 1}. desember{' '}
            <span className="group-hover:translate-x-1 group-hover:transition-all inline-block">&rarr;</span>
          </Link>
        </div>
      )}
    </div>
  )
}
