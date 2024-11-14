import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from '@remix-run/react'
import { generateSecurityHeaders } from 'utils/security'

import { Header } from '~/features/navigation/Header'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async () => {
  return json(
    {},
    {
      headers: generateSecurityHeaders(),
    }
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  type PotentialLanguageType = { language: string } | undefined
  const postData = matches.find((match) => (match.data as PotentialLanguageType)?.language)
    ?.data as PotentialLanguageType

  const isInArticle = matches.some((match) => match.params.slug)

  return (
    <html lang={postData?.language ?? 'nb-NO'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>bekk.christmas</title>
      </head>
      <body className={`m-auto max-w-screen-2xl break-words bg-envelope-beige`}>
        <div className={`${isInArticle && 'striped-frame'}`}>
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

export default function App() {
  return <Outlet />
}
