import React from 'react'
import { lazy, Suspense } from 'react'
import {
  data,
  HeadersFunction,
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  useLocation,
} from 'react-router'
import { getLatestCalendarYear, getOsloDate, getSecondsUntilOsloMidnight } from 'utils/calendar'
import { getSecuredSearchKey } from 'utils/algolia.server'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { generateSecurityHeaders } from 'utils/security'
import { ErrorPage } from './features/error-boundary/ErrorPage'
import { JumpToContent } from './features/jump-to-content/JumpToContent'
import { Konsollhilsen } from './features/konsollhilsen/Konsollhilsen'
import { Snofall } from './features/snofall/Snofall'

import styles from '~/styles/main.css?url'
import { Route } from './+types/root'
import { Toaster } from './components/ui/toaster'
import Header from './features/header/Header'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { preview } = await loadQueryOptions(request.headers)
  const now = new Date()
  const today = getOsloDate(now)
  // Alt som caches må utløpe senest ved midnatt norsk tid, ellers kan nye luker vises som lukket
  const secondsUntilMidnight = getSecondsUntilOsloMidnight(now)
  const maxAge = Math.min(3600, secondsUntilMidnight)
  const sMaxAge = Math.min(7200, secondsUntilMidnight)
  const securedSearchKey = getSecuredSearchKey(today)
  return data(
    {
      isPreview: preview,
      latestCalendarYear: getLatestCalendarYear(today),
      ENV: {
        SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
        SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
        SANITY_STUDIO_API_VERSION: process.env.SANITY_API_VERSION,
      },
      algolia: securedSearchKey && {
        app: process.env.ALGOLIA_APP_ID!,
        key: securedSearchKey.key,
        index: process.env.ALGOLIA_INDEX!,
        availableUntilMillis: securedSearchKey.availableUntilMillis,
      },
    },
    {
      headers: {
        'Cache-Control': preview
          ? 'no-cache, no-store'
          : // Maks 1 time i nettleser og 2 timer i CDN (men aldri forbi midnatt), 1 måned stale-while-revalidate og stale-if-error
            `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=2592000, stale-if-error=2592000`,
        'X-Sanity-Preview': preview ? 'true' : 'false',
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    ...generateSecurityHeaders(),
    ...Object.fromEntries(loaderHeaders),
  }
}

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

const isStudioPath = (pathname: string) => pathname === '/studio' || pathname.startsWith('/studio/')

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  const { pathname } = useLocation()

  // Studioet har sin egen styling, så det får verken header, Tailwind eller sporing
  if (isStudioPath(pathname)) {
    return (
      <html lang="nb-NO">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
        </head>
        <body style={{ margin: 0 }}>
          {children}
          <Scripts />
        </body>
      </html>
    )
  }

  type PotentialPostData = { initial: { data: { language?: string } } } | undefined
  const postData = (
    matches.find((match) => match.id === 'routes/post.$year.$date.$slug')?.loaderData as PotentialPostData
  )?.initial?.data

  const hideHeader = pathname === '/skjerm'

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
        <div className="min-h-screen bg-soft-pink flex flex-col">
          {!hideHeader ? (
            <header>
              <Header />
            </header>
          ) : null}
          <main id="content" tabIndex={-1} className="focus:outline-hidden">
            {children}
          </main>
          <Toaster />
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

const LiveVisualEditing = lazy(() => import('utils/sanity/LiveVisualEditing'))

export default function App() {
  const { ENV, isPreview } = useLoaderData<typeof loader>()
  const { pathname } = useLocation()

  if (isStudioPath(pathname)) {
    return <Outlet />
  }

  return (
    <>
      <Outlet />
      <Konsollhilsen />
      <Snofall />
      {isPreview ? (
        <Suspense fallback={null}>
          <LiveVisualEditing />
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
