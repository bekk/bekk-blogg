import React from 'react'
import type { LinksFunction } from '@remix-run/node'
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

import { BekkLogo } from '~/features/article/BekkLogo'
import { useBreadcrumbs } from '~/hooks/useBreadcrumbs'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = useBreadcrumbs()

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

        <ol className="flex px-4">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex">
              <Link to={breadcrumb.href} key={index}>
                {breadcrumb.title}
              </Link>
              <p className="px-2">/</p>
            </li>
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
