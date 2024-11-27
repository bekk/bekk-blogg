import { lazy, Suspense } from 'react'
import type { HeadersFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
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
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { generateSecurityHeaders } from 'utils/security'

import { ArticleBackgroundSVG } from './features/article/ArticleBackgroundSVG'
import { JumpToContent } from './features/jump-to-content/JumpToContent'

import { Header } from '~/features/navigation/Header'
import { Page404 } from '~/routes/404'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async ({ request }) => {
  const { preview } = await loadQueryOptions(request.headers)
  return json({
    isPreview: preview,
    ENV: {
      SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
      SANITY_STUDIO_API_VERSION: process.env.SANITY_API_VERSION,
    },
  })
}

export const headers: HeadersFunction = () => ({
  ...generateSecurityHeaders(),
})

export function ErrorBoundary() {
  return <Page404 />
}

export function Layout({ children }: { children: React.ReactNode }) {
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
        <link rel="alternate" type="application/rss+xml" title="Bekk Christmas RSS Feed" href="/feed.xml" />
        <script defer data-domain="bekk.christmas" src="https://plausible.io/js/plausible.js" />
      </head>
      <body className={`m-auto min-w-[375px] max-w-screen-2xl break-words bg-envelope-beige`}>
        <JumpToContent />
        {isInArticle && (
          <div className="fixed inset-0 -z-10">
            <ArticleBackgroundSVG />
          </div>
        )}
        <div className={`${isInArticle && 'striped-frame md:my-8 md:mx-8 '}`}>
          <header className={`${isInArticle && 'relative'}`}>
            <Header isInArticle={isInArticle} />
          </header>
          <Scripts />
          {children}
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  )
}

const ExitPreview = lazy(() =>
  import('./components/ExitPreview').then((module) => ({
    default: module.ExitPreview,
  }))
)

export default function App() {
  const { ENV, isPreview } = useLoaderData<typeof loader>()
  return (
    <>
      <Outlet />
      {isPreview ? (
        <Suspense fallback={null}>
          <VisualEditing />
          <ExitPreview />
        </Suspense>
      ) : null}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </>
  )
}
