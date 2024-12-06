import { Link } from '@remix-run/react'
import { MetaFunction } from '@vercel/remix'

import { SnowAnimation } from '~/features/calendar/SnowAnimation'
import Header from '~/features/header/Header'

export const meta: MetaFunction = () => {
  const title = `Fant ikke den siden`
  const description = `Her ser det ut som du har gått deg vill i julekalenderen!`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

type ErrorPageProps = {
  title?: string
  description?: string
}

export const ErrorPage = ({ title, description }: ErrorPageProps) => {
  return (
    <div className="bg-error">
      <header className="relative">
        <Header isOnArticlePage={false} />
      </header>
      <div className="flex min-h-screen flex-col items-left justify-center px-4 md:px-12 sm:pl-8 md:pb-64 text-white">
        <SnowAnimation />
        <h1 className="text-3xl sm:text-4xl max-w-lg">{title}</h1>
        <p className="text-lg md:text-md leading-8 w-10/12 lg:w-5/12 xl:w-4/12">
          {description}
          <Link to="/post/2024">🌟</Link>
        </p>
      </div>
    </div>
  )
}
