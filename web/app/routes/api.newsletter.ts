import { json } from '@remix-run/node'
import * as Brevo from '@getbrevo/brevo'

let contactsClient: Brevo.ContactsApi | null = null
const getContactsClient = () => {
  if (!contactsClient) {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      throw new Error('Brevo API key not found. Ensure it is set in the environment variables.')
    }

    contactsClient = new Brevo.ContactsApi()
    contactsClient.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey)
  }
  return contactsClient
}

export const action = async ({ request }: { request: Request }) => {
  try {
    const { email } = await request.json()
    if (!email) {
      return json({ error: 'Email is required' }, { status: 400 })
    }

    const client = getContactsClient()
    const response = await client.createContact({
      email,
      updateEnabled: true,
      listIds: [3],
    })

    if (response.response.statusCode === 201 || response.response.statusCode === 204) {
      return json({ message: 'Success' })
    }

    return json(
      { error: 'Failed to add user to newsletter. Please try again later.' },
      { status: response.response.statusCode }
    )
  } catch (error) {
    console.error('Error in newsletter signup:', error)
    return json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
