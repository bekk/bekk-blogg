import { LoaderFunctionArgs } from '@remix-run/node'
import OpenAI from 'openai'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { ARTICLE_CONTENT_BY_ID } from 'utils/sanity/queries/postQueries'
import { loadQuery } from 'utils/sanity/store'
import { ARTICLE_CONTENT_BY_IDResult } from 'utils/sanity/types/sanity.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    throw new Response('Missing id parameter', { status: 400 })
  }

  const { options } = await loadQueryOptions(request.headers)
  const { data: post } = await loadQuery<ARTICLE_CONTENT_BY_IDResult>(ARTICLE_CONTENT_BY_ID, { id }, options)

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  // Convert the portable text content to plain text and remove invisible characters
  const text = [post.title, post.description, post.content]
    .join('\n\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u200B-\u200D\uFEFF\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F]/g, '')

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'shimmer',
      input: text.slice(0, 4000),
    })

    const audioStream = await mp3.arrayBuffer()

    return new Response(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioStream.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('OpenAI TTS error:', error)
    throw new Response('Error generating audio', { status: 500 })
  }
}
