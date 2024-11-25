import { LoaderFunctionArgs } from '@remix-run/node'
import OpenAI from 'openai'
import { cleanControlCharacters } from 'utils/controlCharacters'
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
  const text = cleanControlCharacters([post.title, post.description, post.content].join('\n\n'))

  try {
    const textChunks = chunkText(text)

    // Create a ReadableStream to stream the audio chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const voice = await getVoice({ name: post.mainAuthor, preferredVoice: post.preferredVoice })
          // Process each chunk and send it immediately
          for (const chunk of textChunks) {
            const mp3 = await openai.audio.speech.create({
              model: 'tts-1',
              voice,
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
        Connection: 'keep-alive',
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, no-transform',
        'Content-Disposition': 'inline',
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
