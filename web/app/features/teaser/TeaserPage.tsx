import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import Countdown, { CountdownRendererFn } from 'react-countdown'

import { PostPreview } from '../post-preview/PostPreview'

import { LinkToArchive } from '~/components/LinkToArchive'
import { TeaserPageFooter } from '~/components/TeaserPageFooter'
import { BekkLogo } from '../article/BekkLogo'

const useClientSideOnly = () => {
  const [isClientSide, setIsClientSide] = useState(false)
  useEffect(() => {
    setIsClientSide(true)
  }, [])
  return isClientSide
}

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
      <div className="flex justify-center mb-8 gap-2 sm:gap-8 text-lg text-red-berry sm:text-4xl md:text-4xl">
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

export const TeaserPage = () => {
  const isClientSide = useClientSideOnly()

  return (
    <div className="flex flex-col justify-between items-center overflow-y-auto h-screen bg-soft-pink">
      <div className="self-start p-6">
        <BekkLogo className="text-red-berry relative lg:absolute" />
      </div>
      <div className="w-full flex flex-col items-center sm:max-w-4xl flex-grow justify-center mt-6">
        {isClientSide && <Countdown date={`${new Date().getFullYear()}/12/01`} renderer={CountdownRenderer} />}

        <div className="mb-12 lg:mb-0">
          <Link to={`post/${new Date() > new Date(new Date().setFullYear(2024, 12, 1)) ? '2024' : '2023'}`}>
            <PostPreview
              title="bekk.christmas"
              authors={['Bekk']}
              summary="Hver dag en luke, en liten sak, som en bekk som renner, sakte og smak. Åpne med glede, se hva du får, snart er det jul, vi feirer i år!"
              _id="123"
              slug={null}
              coverImage={null}
              tags={['Til deg']}
              wordCount={null}
              podcastLength={null}
            />
          </Link>
        </div>
        <LinkToArchive className="block lg:hidden mb-12" />
      </div>
      <TeaserPageFooter className="hidden lg:flex" />
    </div>
  )
}
