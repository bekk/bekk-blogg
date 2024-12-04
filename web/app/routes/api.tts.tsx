import { LoaderFunctionArgs } from '@vercel/remix'
import OpenAI from 'openai'
import { cleanControlCharacters } from 'utils/controlCharacters'
import { ARTICLE_CONTENT_BY_IDResult } from 'utils/sanity/types/sanity.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function chunkText(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = []
  let currentChunk = ''

  // Split by sentences to avoid cutting words/sentences
  const sentences = text.split(/[.!?]+\s/)

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

export const config = {
  runtime: 'edge',
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    throw new Response('Missing id parameter', { status: 400 })
  }

  const post = await getSanityContentTheOldFashionedWay(id)

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  // Convert the portable text content to plain text and remove invisible characters
  const text = cleanControlCharacters([post.title, post.description, post.content].join('\n\n'))

  // Create an AbortController to handle disconnection
  const abortController = new AbortController()

  // Listen for client disconnect
  request.signal.addEventListener('abort', () => {
    abortController.abort()
  })

  try {
    const textChunks = chunkText(text)

    // Create a ReadableStream to stream the audio chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const voice = await getVoice({
            name: post.mainAuthor,
            preferredVoice: post.preferredVoice,
          })
          console.time('tts total')
          // Process each chunk and send it immediately
          for (const chunk of textChunks) {
            // Check if the client has disconnected
            if (request.signal.aborted) {
              controller.close()
              console.log('Client disconnected, stopping TTS generation')
              return
            }

            // Empty chunks are not allowed by OpenAI
            if (chunk.length < 1) {
              continue
            }
            console.time('tts chunk')
            const mp3 = await openai.audio.speech.create(
              {
                model: 'tts-1',
                voice,
                input: chunk,
                response_format: 'mp3',
              },
              {
                signal: abortController.signal, // Pass the abort signal to OpenAI requests
              }
            )

            const audioStream = await mp3.arrayBuffer()
            controller.enqueue(new Uint8Array(audioStream))
            console.timeEnd('tts chunk')
          }
          controller.close()
          console.timeEnd('tts total')
        } catch (error) {
          // Don't throw error if it's an abort error
          if (error instanceof Error && error.name === 'AbortError') {
            controller.close()
            return
          }
          controller.error(error)
        }
      },
      cancel() {
        abortController.abort()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        Connection: 'keep-alive',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-store, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('OpenAI TTS error:', error)
    throw new Response('Error generating audio', { status: 500 })
  }
}

type GetVoiceArgs = {
  name: string | null
  preferredVoice?: 'onyx' | 'nova' | 'none' | 'shimmer' | null
}
const getVoice = async ({ name, preferredVoice }: GetVoiceArgs) => {
  if (!name) {
    return 'nova' // Burde ikke skje, men i tilfeller der man ikke har fyllt ut navn enda, vil man bruke denne stemmen
  }
  // Hvis brukeren har valgt en stemme, returner den
  if (preferredVoice && ['onyx', 'nova', 'shimmer'].includes(preferredVoice)) {
    return preferredVoice as 'onyx' | 'nova' | 'shimmer'
  }
  // Hvis brukeren ikke har valgt en stemme, bestemmer vi stemmen ut fra navnet
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that can determine the gender of a name. Only respond with either "male" or "female".',
      },
      { role: 'user', content: `what is the gender of the following name? ${name}` },
    ],
  })
  const gender = response.choices[0].message.content
  return gender === 'male' ? 'onyx' : 'nova'
}

const getSanityContentTheOldFashionedWay = async (id: string) => {
  const response = await fetch(`
https://ah2n1vfr.api.sanity.io/v2024-12-04/data/query/bekk-blogg-prod?query=*%5B_type+%3D%3D+%22post%22+%26%26+type+%3D%3D+%22article%22+%26%26+_id+%3D%3D+%24id%5D%5B0%5D+%7B+%0A++title%2C+%0A++%22description%22%3A+pt%3A%3Atext%28description%29%2C+%0A++%22content%22%3A+pt%3A%3Atext%28content%29%2C+%0A++%22mainAuthor%22%3A+authors%5B0%5D-%3EfullName%2C%0A++%22preferredVoice%22%3A+authors%5B0%5D-%3EpreferredVoice%0A++%7D&%24id=%22${id}%22&perspective=published`)
  if (response.ok) {
    const data = await response.json()
    return data.result as ARTICLE_CONTENT_BY_IDResult
  }
  return null
}
