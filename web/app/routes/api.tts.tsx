import { LoaderFunctionArgs } from '@remix-run/node'
import OpenAI from 'openai'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'
import { ARTICLE_CONTENT_BY_ID } from 'utils/sanity/queries/postQueries'
import { loadQuery } from 'utils/sanity/store'
import { ARTICLE_CONTENT_BY_IDResult } from 'utils/sanity/types/sanity.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function chunkText(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = []
  let currentChunk = ''

  // Split by sentences to avoid cutting words/sentences
  const sentences = text.split('. ')

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk)
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

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
    const textChunks = chunkText(text)

    // Create a ReadableStream to stream the audio chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Process each chunk and send it immediately
          for (const chunk of textChunks) {
            const mp3 = await openai.audio.speech.create({
              model: 'tts-1',
              voice: 'shimmer',
              input: chunk,
            })

            const audioBuffer = await mp3.arrayBuffer()
            controller.enqueue(new Uint8Array(audioBuffer))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
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
