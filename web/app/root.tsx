import React from 'react'
import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from '@remix-run/react'

import { Header } from '~/features/navigation/Header'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  const isInArticle = matches.some((match) => match.params.slug)

  return (
    <html lang="en">
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
