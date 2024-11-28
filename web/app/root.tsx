import { lazy, Suspense } from 'react'
import type { HeadersFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { VisualEditing } from '@sanity/visual-editing/remix'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { generateSecurityHeaders } from 'utils/security'

import { JumpToContent } from './features/jump-to-content/JumpToContent'
import { ErrorPage } from './routes/ErrorPage'

import { Header } from '~/features/header/Header'
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
            title = 'Fant ikke den forfatteren'
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
  const { year, date, slug } = useParams()
  const error = useRouteError()
  const matches = useMatches()
  const location = useLocation()

  type PotentialLanguageType = { language: string } | undefined
  const postData = matches.find((match) => (match.data as PotentialLanguageType)?.language)
    ?.data as PotentialLanguageType

  const isOnFrontPage = location.pathname === '/'
  const isOnArticlePage = !!slug && !error
  const isOnDatePage = !!date && !slug && !error
  const isOnCalendarPage = !!year && !date && !error
  const isOnArticleListPage =
    isOnDatePage || location.pathname.includes('/kategori/') || location.pathname.includes('/forfatter/')

  const bodyBackground = () => {
    if (isOnFrontPage || isOnDatePage || isOnArticleListPage) return `bg-wooden-table-with-cloth`
    if (isOnArticlePage) return 'bg-wooden-table'
    if (isOnCalendarPage) return 'bg-brick-wall h-screen'
    return 'bg-envelope-beige'
  }

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
      {/* <body className={`${error ? 'error-bg' : `m-auto min-w-[375px] max-w-screen-2xl break-words ${bodyBg()}`}`}> */}
      {/* <body className={`break-words m-auto w-full max-w-screen-2xl ${bodyBackground()}`}> */}
      <body className={`${error ? 'error-bg' : `break-words m-auto w-full max-w-screen-2xl ${bodyBackground()}`}`}>
        <JumpToContent />
        <div className={`${isOnArticlePage && 'striped-frame md:my-8 md:mx-8 '}`}>
          {!isOnCalendarPage && (
            <header className={`${isOnArticlePage && 'relative'}`}>
              <Header isOnArticlePage={isOnArticlePage} />
            </header>
          )}

          <Scripts />
          <main id="content" className="tabindex-[-1]">
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
