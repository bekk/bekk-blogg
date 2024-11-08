import { createCookie } from '@remix-run/node'
import { Params } from '@remix-run/react'
import { Authenticator } from 'remix-auth'
import { MicrosoftStrategy } from 'remix-auth-microsoft'

import {
  getApplicationRoot,
  getClientId,
  getClientSecret,
  getScopes,
  getSessionSecret,
  getTenantId,
} from './config.server'

import { sessionStorage } from '~/server/session.server'

export type UserData = {
  accessToken: string
}

export const authenticator = new Authenticator<UserData>(sessionStorage)

const entraIdStrategy = new MicrosoftStrategy(
  {
    redirectUri: `${getApplicationRoot()}/microsoft/callback`,
    clientId: getClientId(),
    clientSecret: getClientSecret(),
    scope: getScopes(),
    tenantId: getTenantId(),
    prompt: '',
  },
  async ({ accessToken }) => {
    return {
      accessToken,
    }
  }
)

authenticator.use(entraIdStrategy)

export const returnToCookie = createCookie('returnTo', {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: [getSessionSecret()],
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600,
})

export const getUserDataOrAuthenticate = async ({ request, params }: { request: Request; params: Params<string> }) => {
  const requestUrl = new URL(request.url)

  return await authenticator.isAuthenticated(request, {
    failureRedirect: Object.values(params).length > 0 ? '/auth/login' + `?returnTo=${requestUrl.pathname}` : '/',
  })
}
