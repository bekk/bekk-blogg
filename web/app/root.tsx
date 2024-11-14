import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import { json, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { getCSP, NONE, SELF, UNSAFE_EVAL, UNSAFE_INLINE } from 'csp-header'

import { BekkLogo } from '~/features/article/BekkLogo'
import styles from '~/styles/main.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async () => {
  const csp = getCSP({
    directives: {
      'default-src': [SELF],
      'script-src': [
        SELF,
        UNSAFE_INLINE,
        UNSAFE_EVAL,
        '*.codepen.io',
        '*.twitter.com',
        '*.x.com',
        'cdn.syndication.twimg.com',
      ],
      'style-src': [SELF, UNSAFE_INLINE],
      'img-src': [SELF, 'data:', 'cdn.sanity.io', '*'],
      'connect-src': [SELF, 'api.sanity.io'],
      'frame-src': [SELF, '*.youtube.com', '*.codesandbox.io', 'player.vimeo.com'],
      'font-src': [SELF],
      'object-src': [NONE],
      'media-src': [SELF],
      'child-src': [SELF, '*.youtube.com'],
    },
  })

  return json(
    {},
    {
      headers: {
        'Content-Security-Policy': process.env.NODE_ENV === 'development' ? csp.replace(/;/g, '; report-only') : csp,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Permissions-Policy': [
          'accelerometer=()',
          'camera=()',
          'geolocation=()',
          'gyroscope=()',
          'magnetometer=()',
          'microphone=()',
          'payment=()',
          'usb=()',
          'interest-cohort=()',
        ].join(', '),
        'X-XSS-Protection': '1; mode=block',
      },
    }
  )
}

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
        <header className={'flex justify-end p-4 md:px-10 md:pb-7 md:pt-8'}>
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
