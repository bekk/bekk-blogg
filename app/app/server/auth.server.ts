import { Authenticator } from 'remix-auth'
import { MicrosoftStrategy } from 'remix-auth-microsoft'
import {
  getSanityRoot,
  getClientId,
  getClientSecret,
  getEmailFromToken,
  getScopes,
  getSessionSecret,
  getTenantId,
} from './config.server'
import { createCookie } from '@remix-run/node'
import { Params } from '@remix-run/react'
import { sessionStorage } from '~/server/session.server'

export type UserData = {
  accessToken: string;
  email: string;
};

export const authenticator = new Authenticator<UserData>(sessionStorage)

const entraIdStrategy = new MicrosoftStrategy(
  {
    redirectUri: `${getSanityRoot()}`,
    clientId: getClientId(),
    clientSecret: getClientSecret(),
    scope: getScopes(),
    tenantId: getTenantId(),
    prompt: '',
  },
  async ({accessToken, extraParams}) => {
    const email = getEmailFromToken(extraParams.id_token);

    if (!email) {
      throw new Error('Missing employee ID on token');
    }

    return {
      accessToken,
      email
    };
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
