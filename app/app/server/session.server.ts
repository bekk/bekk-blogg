import { createCookieSessionStorage } from '@remix-run/node'

import { getSessionSecret } from '~/server/config.server'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_name',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [getSessionSecret()],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
  },
})
