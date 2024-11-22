import { createCookieSessionStorage } from '@remix-run/node'

export const PREVIEW_SESSION_NAME = '__preview'

if (!process.env.SANITY_SESSION_SECRET) {
  throw new Error(`Missing SANITY_SESSION_SECRET in .env`)
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: PREVIEW_SESSION_NAME,
    secrets: [process.env.SANITY_SESSION_SECRET],
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})

export { commitSession, destroySession, getSession }
