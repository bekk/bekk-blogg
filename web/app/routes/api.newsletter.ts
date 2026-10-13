import { BrevoClient, BrevoError } from '@getbrevo/brevo'
import { ActionFunctionArgs } from 'react-router'
import { z } from 'zod'

let brevoClient: BrevoClient | null = null
const getBrevoClient = () => {
  if (!brevoClient) {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      throw new Error('Brevo API key not found. Ensure it is set in the environment variables.')
    }

    brevoClient = new BrevoClient({ apiKey })
  }
  return brevoClient
}

const SignupSchema = z.object({
  email: z.email().max(254),
})

const DEFAULT_LIST_ID = 3

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Påmeldingen skal bare kunne gjøres fra vår egen side, ikke fra andre nettsteder
  const origin = request.headers.get('Origin')
  const requestOrigin = new URL(request.url).origin
  if (origin !== requestOrigin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = SignupSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'A valid email is required' }, { status: 400 })
  }
  const { email } = parsed.data
  const listId = Number(process.env.BREVO_LIST_ID ?? DEFAULT_LIST_ID)
  const doiTemplateId = process.env.BREVO_DOI_TEMPLATE_ID

  try {
    // Brevo v6 kaster BrevoError på ikke-2xx i stedet for å returnere en
    // statuskode, så alt som kommer hit uten å kaste er en suksess.
    if (doiTemplateId) {
      // Double opt-in: kontakten legges først i lista når e-posten er bekreftet,
      // så ingen kan melde på andre enn seg selv
      await getBrevoClient().contacts.createDoiContact({
        email,
        includeListIds: [listId],
        templateId: Number(doiTemplateId),
        redirectionUrl: `${requestOrigin}/`,
      })
    } else {
      await getBrevoClient().contacts.createContact({
        email,
        updateEnabled: true,
        listIds: [listId],
      })
    }

    return { message: 'Success' }
  } catch (error) {
    if (error instanceof BrevoError) {
      console.error('Error in newsletter signup:', error.statusCode, error.body)
    } else {
      console.error('Error in newsletter signup:', error)
    }
    // Brevo sine statuskoder sendes ikke videre til klienten
    return Response.json({ error: 'Failed to add user to newsletter. Please try again later.' }, { status: 502 })
  }
}
