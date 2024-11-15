import { useEffect, useState } from 'react'
import Countdown, { CountdownRendererFn } from 'react-countdown'
import { Link } from '@remix-run/react'

import { Letter } from '../door/Letter'

import { mockPost } from './mockPost'

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
    return <h1>It is happening!</h1>
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
  const isClientSide = useClientSideOnly()
  return (
    <main id="content" className="flex flex-col items-center justify-center w-screen h-screen pb-64 px-4 min-w-[320px]">
      <div className="w-full items-center sm:max-w-4xl">
        {isClientSide && (
          <div className="font-delicious text-2xl sm:text-5xl">
            <Countdown date={`${new Date().getFullYear()}/12/01`} renderer={CountdownRenderer} />
          </div>
        )}
        <div className="mt-16">
          <Link to={`/${new Date() > new Date(new Date().setFullYear(2024, 12, 1)) ? '2024' : '2023'}`}>
            <Letter post={mockPost} showReadTime={false} />
          </Link>
        </div>
      </div>
    </main>
  )
}
