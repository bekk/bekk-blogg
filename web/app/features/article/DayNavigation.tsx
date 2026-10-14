import { Link } from 'react-router'
import { isDoorOpen } from 'utils/calendar'

type DayNavigationProps = {
  day: number
  year: number
  /** Dagens dato i norsk tid (YYYY-MM-DD) */
  today: string
}
export const DayNavigation = ({ day, year, today }: DayNavigationProps) => {
  const canShowNextDay = isDoorOpen(year, day + 1, today)

  return (
    <div className="flex justify-center gap-4 my-8">
      {day > 1 && (
        <div className="rounded-lg focus-within:ring-1 focus-within:ring-offset-4 focus-within:ring-red-berry">
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
        <div className="rounded-lg focus-within:ring-1 focus-within:ring-offset-4 focus-within:ring-red-berry">
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
