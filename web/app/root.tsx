import type { LinksFunction } from '@remix-run/node'
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

import { BekkLogo } from '~/features/article/BekkLogo'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export function Layout({ children }: { children: React.ReactNode }) {
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
        <header className={'flex justify-end px-10 pb-7 pt-8'}>
          <Link to={'/'}>
            <BekkLogo fillColor={'fill-black'} />
          </Link>
        </header>
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
