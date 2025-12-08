import { useLoaderData } from 'react-router'
import { Door } from '~/features/calendar/Door'

export const CalendarWithDoors = () => {
  const data = useLoaderData<{ year: string }>()
  return (
    <ol
      className="grid h-full 2lg:grid-cols-[repeat(6,auto)] 2lg:grid-rows-[repeat(4,auto)] md:grid-cols-[repeat(4,auto)] md:grid-rows-[repeat(6,auto)] grid-cols-[repeat(3,auto)] grid-rows-[repeat(8,auto)] justify-center border-14 border-mid-green bg-mid-green"
      aria-label="Julekalender med 24 luker"
    >
      {Array.from({ length: 24 }, (_, i) => {
        const date = i + 1
        return (
          <li key={date} className="flex justify-center items-center border-4 border-mid-green">
            <Door year={Number(data.year)} date={date} />
          </li>
        )
      })}
    </ol>
  )
}
