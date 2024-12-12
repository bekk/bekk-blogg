import { Link } from '@remix-run/react'

import { SnowAnimation } from '~/features/calendar/SnowAnimation'
import Header from '~/features/header/Header'

type ErrorPageProps = {
  title?: string
  description?: string
}

export const ErrorPage = ({ title, description }: ErrorPageProps) => {
  return (
    <div className="bg-error">
      <header className="relative">
        <Header />
      </header>
      <div className="flex min-h-screen flex-col items-left justify-center px-4 md:px-12 sm:pl-8 md:pb-64 text-white">
        <SnowAnimation />
        <h1 className="text-3xl sm:text-4xl max-w-lg">{title}</h1>
        <p className="text-lg md:text-md leading-8 w-10/12 lg:w-5/12 xl:w-4/12">
          {description}
          <Link to="/" aria-label="Gå til forsiden">
            🌟
          </Link>
        </p>
      </div>
    </div>
  )
}
