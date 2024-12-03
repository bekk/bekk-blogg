import type { loadQuery } from '@sanity/react-loader'
import { getSession } from 'utils/sessions'

import { readClient } from './sanity.server'

export async function loadQueryOptions(
  headers: Headers
): Promise<{ preview: boolean; options: Parameters<typeof loadQuery>[2] }> {
  const previewSession = await getSession(headers.get('Cookie'))
  const preview = previewSession.get('projectId') === readClient.config().projectId

  if (preview && !process.env.SANITY_READ_API_TOKEN) {
    throw new Error(
      `Cannot activate preview mode without a "SANITY_READ_API_TOKEN" token in your environment variables.`
    )
  }

  return {
    preview,
    options: {
      perspective: preview ? 'previewDrafts' : 'published',
      stega: preview ? { enabled: true, studioUrl: process.env.SANITY_STUDIO_URL } : undefined,
    },
  }
}
