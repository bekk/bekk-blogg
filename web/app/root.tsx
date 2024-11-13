import React from 'react'
import type { LinksFunction } from '@remix-run/node'
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from '@remix-run/react'

import { BekkLogo } from '~/features/article/BekkLogo'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

type Handle = {
  breadCrumb: string
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  console.log('matches', matches)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>bekk.christmas</title>
      </head>
      <body className="m-auto break-words bg-envelope-beige">
        <header className={'flex justify-end p-4 md:px-10 md:pb-7 md:pt-8'}>
          <Link to={'/'}>
            <BekkLogo fillColor={'fill-black'} />
          </Link>
        </header>
        <ol className="px-4">
          {matches
            .filter((match) => (match.handle as Handle) && match.handle.breadcrumb)
            .map((match, index) => (
              <li key={index}>{match.handle.breadcrumb(match)}</li>
            ))}
        </ol>
        <Scripts />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
