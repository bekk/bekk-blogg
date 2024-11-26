import { Link } from '@remix-run/react'

type DayNavigationProps = {
  day: number
  year: number
}
export const DayNavigation = ({ day, year }: DayNavigationProps) => {
  return (
    <div className="flex justify-center gap-4 my-8">
      {day > 1 && (
        <Link
          to={`/post/${year}/${day - 1}`}
          prefetch="intent"
          className="group text-bekk-night hover:text-reindeer-brown"
        >
          <span className="group-hover:-translate-x-1 group-hover:transition-all inline-block ">&larr;</span> {day - 1}.
          desember
        </Link>
      )}
      {day < 24 && (
        <Link
          to={`/post/${year}/${day + 1}`}
          prefetch="intent"
          className="group text-bekk-night hover:text-reindeer-brown"
        >
          {day + 1}. desember{' '}
          <span className="group-hover:translate-x-1 group-hover:transition-all inline-block">&rarr;</span>
        </Link>
      )}
    </div>
  )
}
