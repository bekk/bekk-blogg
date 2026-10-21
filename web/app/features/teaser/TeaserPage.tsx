import Countdown, { CountdownRendererFn } from 'react-countdown'
import { Link } from 'react-router'

import { PostPreview } from '../post-preview/PostPreview'

import { useHydrated } from '~/hooks/useHydrated'
import { TeaserPageFooter } from './TeaserPageFooter'

interface CountdownRendererFnProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const CountdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: CountdownRendererFnProps) => {
  if (completed) {
    return <h1>Nå skjer det!</h1>
  } else {
    return (
      <div
        data-nisse-flate
        className="flex justify-center mb-8 gap-2 sm:gap-8 text-lg text-red-berry sm:text-4xl md:text-4xl"
      >
        <NumberWithLabel number={days} label="Dager" />
        <NumberWithLabel number={hours} label="Timer" />
        <NumberWithLabel number={minutes} label="Minutter" />
        <NumberWithLabel number={seconds} label="Sekunder" />
      </div>
    )
  }
}

const NumberWithLabel = ({ number, label }: { number: number; label: string }) => (
  <div className="flex flex-col items-center mx-4 gap-7">
    <p className="text-5xl">{number}</p>
    <p>{label}</p>
  </div>
)

type TeaserPageProps = {
  /** Når årets kalender starter, som ISO-tidspunkt */
  launchDate: string
  /** Fjorårets kalender, som teaseren lenker til mens man venter */
  previousYear: number
}

export const TeaserPage = ({ launchDate, previousYear }: TeaserPageProps) => {
  const isClientSide = useHydrated()

  return (
    <div className="flex flex-col justify-between items-center">
      <div className="w-full flex flex-col items-center sm:max-w-4xl flex-grow justify-center mt-6">
        {isClientSide && <Countdown date={launchDate} renderer={CountdownRenderer} />}
        <div data-nisse-flate className="mb-12 lg:mb-0">
          <Link to={`/post/${previousYear}`}>
            <PostPreview
              title="bekk.christmas"
              authors={['Bekk']}
              summary="24 dager med feiring av fagmiljøet og delingskulturen vår – for tiende år på rad"
              _id="123"
              slug={null}
              coverImage={null}
              tags={['Til deg']}
              wordCount={null}
              podcastLength={null}
            />
          </Link>
        </div>
      </div>
      <TeaserPageFooter />
    </div>
  )
}
