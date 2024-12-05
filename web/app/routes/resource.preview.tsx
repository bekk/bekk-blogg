import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { type ActionFunction, type LoaderFunctionArgs, redirect } from '@vercel/remix'
import { readClient } from 'utils/sanity/sanity.server'
import { commitSession, destroySession, getSession } from 'utils/sessions'

// A `POST` request to this route will exit preview mode
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const session = await getSession(request.headers.get('Cookie'))

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

// A `GET` request to this route will enter preview mode
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!process.env.SANITY_READ_API_TOKEN) {
    console.error('Preview mode missing token')
    throw new Response('Preview mode missing token', { status: 401 })
  }

  const clientWithToken = readClient.withConfig({
    token: process.env.SANITY_READ_API_TOKEN,
  })

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(clientWithToken, request.url)

  if (!isValid) {
    console.error('Preview mode invalid secret')
    throw new Response('Invalid secret', { status: 401 })
  }

  const session = await getSession(request.headers.get('Cookie'))
  await session.set('projectId', readClient.config().projectId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
