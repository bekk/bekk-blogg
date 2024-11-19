import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react'
import { VisualEditing } from '@sanity/visual-editing/remix'
import { generateSecurityHeaders } from 'utils/security'

import { Header } from '~/features/navigation/Header'
import { Page404 } from '~/routes/404'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async () => {
  return json(
    {
      preview: process.env.NODE_ENV === 'development',
      ENV: {
        SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
        SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
        SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
        SANITY_STUDIO_API_VERSION: process.env.SANITY_API_VERSION,
      },
    },
    {
      headers: generateSecurityHeaders(),
    }
  )
}

export function ErrorBoundary() {
  return (
    <html lang={'nb-NO'}>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Page404 />
        <Scripts />
      </body>
    </html>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { preview, ENV } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const error = useRouteError()
  type PotentialLanguageType = { language: string } | undefined
  const postData = matches.find((match) => (match.data as PotentialLanguageType)?.language)
    ?.data as PotentialLanguageType

  const isInArticle = matches.some((match) => match.params.slug) && !error

  return (
    <html lang={postData?.language ?? 'nb-NO'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>bekk.christmas</title>
      </head>
      <body className={`m-auto min-w-[375px] max-w-screen-2xl break-words bg-envelope-beige`}>
        <div className={`${isInArticle && 'striped-frame md:my-8 md:mx-8 '}`}>
          <header className={`${isInArticle && 'relative'}`}>
            <Header isInArticle={isInArticle} />
          </header>
          <Scripts />
          {children}
          {preview ? <VisualEditing /> : null}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(ENV)}`,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
