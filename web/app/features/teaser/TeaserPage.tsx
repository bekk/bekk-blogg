import { useEffect, useState } from 'react'
import { CountdownRendererFn } from 'react-countdown'
import { Link } from '@remix-run/react'

import { PostPreview } from '../post-preview/PostPreview'

import { LinkToArchive } from '~/components/LinkToArchive'

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
      <div className="flex justify-center">
        <NumberWithLabel number={days} label="Dager" />
        <NumberWithLabel number={hours} label="Timer" />
        <NumberWithLabel number={minutes} label="Minutter" />
        <NumberWithLabel number={seconds} label="Sekunder" />
      </div>
    )
  }
}

const NumberWithLabel = ({ number, label }: { number: number; label: string }) => (
  <div className="flex flex-col items-center mx-4">
    <p className="text-5xl">{number}</p>
    <p>{label}</p>
  </div>
)

export const TeaserPage = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 h-full pb-96">
      <div className="w-full items-center sm:max-w-4xl">
        <div className="mt-16">
          <Link to="post/2024">
            <PostPreview
              title="Bekk.christmas"
              authors={['Bekk']}
              summary="24 dager med feiring av fagmiljøet og delingskulturen vår"
              _id="123"
              slug={null}
              coverImage={null}
              tags={['Til deg']}
              wordCount={null}
              podcastLength={null}
            />
          </Link>
        </div>
        <div className="link-to-archive-gift">
          <LinkToArchive />
        </div>
      </div>
    </div>
  )
}
