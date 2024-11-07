import { LoaderFunctionArgs } from '@remix-run/node'

import { authenticator, returnToCookie } from '~/server/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo') as string | null

  try {
    return await authenticator.authenticate('microsoft', request)
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      error.headers.append('Set-Cookie', await returnToCookie.serialize(returnTo))
    }
    throw error
  }
}
