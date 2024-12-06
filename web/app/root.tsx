import {
  isRouteErrorResponse,
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
import type { HeadersFunction, LinksFunction, LoaderFunction } from '@vercel/remix'
import { lazy, Suspense } from 'react'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { generateSecurityHeaders } from 'utils/security'

import { ErrorPage } from './features/error-boundary/ErrorPage'
import { JumpToContent } from './features/jump-to-content/JumpToContent'

import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async ({ request }) => {
  const { preview } = await loadQueryOptions(request.headers)
  return {
    isPreview: preview,
    ENV: {
      SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
      SANITY_STUDIO_API_VERSION: process.env.SANITY_API_VERSION,
    },
  }
}

export const headers: HeadersFunction = () => ({
  ...generateSecurityHeaders(),
  // 1 hour max-age, 2 hours s-maxage, 1 month stale-while-revalidate, 1 month stale-if-error
  'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=2592000, stale-if-error=2592000',
})

export function ErrorBoundary() {
  const error = useRouteError()

  const getErrorContent = () => {
    let title = ''
    let message = 'Følg Bekk-stjernen for å komme tilbake til julekalenderen'
    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 400:
          title = 'Ups. Her prøver du å gå til en ugyldig side.'
          break
        case 401:
          title = 'Ups. Preview er ikke tilgjengelig for denne siden.'
          break
        case 404:
          if (error.data === 'Author not found') {
            title = 'Denne forfatteren finnes ikke'
          } else if (error.data === 'No category with this name') {
            title = 'Denne kategorien finnes ikke'
          } else {
            title = 'Denne siden finnes ikke.'
          }
          break
        case 425:
          title = 'Dette innholdet er ikke tilgjengelig enda. Vær tålmodig og sjekk tilbake om litt!'
          break
        default:
          title = 'Uventet feil'
          message = 'Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen.'
      }
    } else {
      title = 'Uventet feil'
      message = 'Her gikk noe galt. Prøv å refresh siden. Eller følg Bekk-stjernen tilbake til julekalenderen.'
    }

    return {
      title: title,
      message: message,
    }
  }

  const { title, message } = getErrorContent()

  return <ErrorPage title={title} description={message} />
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()

  type PotentialLanguageType = { language: string } | undefined
  const postData = matches.find((match) => (match.data as PotentialLanguageType)?.language)
    ?.data as PotentialLanguageType

  return (
    <html lang={postData?.language ?? 'nb-NO'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="alternate" type="application/rss+xml" title="Bekk Christmas RSS Feed" href="/rss.xml" />
        <script defer data-domain="bekk.christmas" src="https://plausible.io/js/plausible.js" />
      </head>
      <body>
        <JumpToContent />
        <div>
          <Scripts />
          <main id="content" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
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
