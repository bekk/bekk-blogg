import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

/**
 * Sjekker at en webhook faktisk kommer fra Sanity. Gir body-en som tekst, eller en
 * feilrespons som skal returneres direkte.
 */
export async function readSanityWebhook(request: Request): Promise<{ body: string } | { error: Response }> {
  if (request.method !== 'POST') {
    return { error: new Response('Method not allowed', { status: 405 }) }
  }
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  if (typeof signature !== 'string') {
    return { error: new Response('Missing or malformed signature', { status: 400 }) }
  }

  if (!request.body) {
    return { error: new Response('Missing body', { status: 400 }) }
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    // Uten hemmelighet kan hvem som helst signere med en tom nøkkel, så avvis alt
    console.error('SANITY_WEBHOOK_SECRET is not set, rejecting webhook')
    return { error: new Response('Webhook not configured', { status: 500 }) }
  }

  const body = await request.text()
  if (!(await isValidSignature(body, signature, secret))) {
    return { error: new Response('Invalid signature', { status: 401 }) }
  }
  return { body }
}
