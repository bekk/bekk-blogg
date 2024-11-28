import { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  const title = `Fant ikke den siden`
  const description = `Her ser det ut som du har gått deg vill i julekalenderen!`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/og-image.png' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: '/og-image.png' },
  ]
}

type ErrorPageProps = {
  title?: string
  description?: string
}

export const ErrorPage = ({ title, description }: ErrorPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-left justify-center px-4 md:px-12 sm:pl-8 md:pb-64 text-white">
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      <h2 className="text-sm md:text-subtitle-desktop leading-8 w-10/12 lg:w-5/12 xl:w-4/12">
        {description}
        <Link to="/post/2024">🌟</Link>
      </h2>
    </div>
  )
}
