import { BrevoClient, BrevoError } from '@getbrevo/brevo'

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

export const action = async ({ request }: { request: Request }) => {
  try {
    const { email } = await request.json()
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Brevo v6 kaster BrevoError på ikke-2xx i stedet for å returnere en
    // statuskode, så alt som kommer hit uten å kaste er en suksess.
    await getBrevoClient().contacts.createContact({
      email,
      updateEnabled: true,
      listIds: [3],
    })

    return { message: 'Success' }
  } catch (error) {
    if (error instanceof BrevoError) {
      console.error('Error in newsletter signup:', error.statusCode, error.body)
      return Response.json(
        { error: 'Failed to add user to newsletter. Please try again later.' },
        { status: error.statusCode ?? 502 }
      )
    }

    console.error('Error in newsletter signup:', error)
    return Response.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
