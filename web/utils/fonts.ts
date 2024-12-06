import { LinksFunction } from '@vercel/remix'

import styles from '~/styles/main.css?url'

export const fontLinks: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'preload',
    href: '/fonts/GT-America-Standard-Regular.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: '/fonts/GT-America-Standard-Medium.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: '/fonts/GT-America-Expanded-Medium.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: '/fonts/SourceSerifPro-Bold.ttf',
    as: 'font',
    type: 'font/ttf',
    crossOrigin: 'anonymous',
  },
]
