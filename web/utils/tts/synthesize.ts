import type OpenAI from 'openai'

/**
 * Alt som påvirker hvordan lyden blir, og som derfor inngår i hashen. Endrer du
 * noe her som skal gi ny lyd for alle artikler, øk `TTS_VERSION`.
 */
export const TTS_VERSION = 1
export const TTS_MODEL = 'gpt-4o-mini-tts'
/** Maks antall tegn per kall. Modellen tåler ca. 2000 tokens, og færre biter gir færre skjøter. */
export const TTS_CHUNK_SIZE = 1500
/** Antall kall mot OpenAI som kjører samtidig for én artikkel */
export const TTS_CONCURRENCY = 4

export type ArticleLanguage = 'nb-NO' | 'nn-NO' | 'en-US'
export type PreferredVoice = 'onyx' | 'nova' | 'shimmer' | 'none'

const TTS_INSTRUCTIONS: Record<ArticleLanguage, string> = {
  'nb-NO':
    'Teksten er skrevet på norsk bokmål. Les den høyt på naturlig norsk, med norsk uttale. Bruk et rolig, engasjert og tydelig tempo, slik man leser en fagartikkel høyt. Engelske fagbegreper og kodenavn uttales på engelsk.',
  'nn-NO':
    'Teksten er skriven på nynorsk. Les han høgt på naturleg norsk, med norsk uttale. Bruk eit roleg, engasjert og tydeleg tempo, slik ein les ein fagartikkel høgt. Engelske faguttrykk og kodenamn blir uttalte på engelsk.',
  'en-US':
    'The text is written in English. Read it aloud in natural, clear English. Use a calm, engaged and steady pace, like reading a technical article aloud.',
}

export const getInstructions = (language: string | null | undefined) =>
  TTS_INSTRUCTIONS[(language ?? 'nb-NO') as ArticleLanguage] ?? TTS_INSTRUCTIONS['nb-NO']

// Stemmene i Sanity er fra den gamle tts-1-modellen. De mappes til de nyere
// stemmene marin og cedar, som OpenAI anbefaler for gpt-4o-mini-tts.
const voiceMap = {
  onyx: 'cedar',
  nova: 'marin',
  shimmer: 'shimmer',
} as const
export type Voice = (typeof voiceMap)[keyof typeof voiceMap]

/**
 * Velger stemme. Har forfatteren valgt en, brukes den. Ellers gjettes det ut fra
 * navnet, med et ekstra kall mot OpenAI. Svaret fra det kallet kan variere, så
 * stemmen lagres sammen med lyden og gjenbrukes ved neste generering.
 */
export async function resolveVoice(
  openai: OpenAI,
  { authorName, preferredVoice }: { authorName: string | null; preferredVoice: PreferredVoice | null }
): Promise<Voice> {
  if (preferredVoice && preferredVoice !== 'none' && preferredVoice in voiceMap) {
    return voiceMap[preferredVoice]
  }
  if (!authorName) {
    return voiceMap.nova
  }
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that can determine the gender of a name. Only respond with either "male" or "female".',
      },
      { role: 'user', content: `what is the gender of the following name? ${authorName}` },
    ],
  })
  return response.choices[0].message.content === 'male' ? voiceMap.onyx : voiceMap.nova
}

// Usynlige tegn (bl.a. stega fra Sanity) fjernes. Linjeskift beholdes, så
// overskrifter og avsnitt ikke limes sammen.
const invisibleCharacters =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u2064\uFEFF]/g
const unusualSpaces = /[\u2000-\u200A\u00A0]/g

/** Teksten som leses opp: tittel, ingress og innhold */
export function getSpokenText(post: { title?: string | null; description?: string | null; content?: string | null }) {
  return [post.title, post.description, post.content]
    .filter(Boolean)
    .join('\n\n')
    .replace(unusualSpaces, ' ')
    .replace(invisibleCharacters, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Deler teksten i biter på maks `chunkSize` tegn, helst ved slutten av et avsnitt
 * eller en setning. Tegnsettingen beholdes, så spørsmål og utrop leses riktig.
 */
export function chunkText(text: string, chunkSize: number = TTS_CHUNK_SIZE): string[] {
  // Setninger, eller linjer uten avsluttende tegnsetting (f.eks. overskrifter)
  const sentences = text.match(/[^.!?\n]+(?:[.!?]+|\n+|$)[^\S\n]*\n*/g) ?? []
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if (current && (current + sentence).length > chunkSize) {
      chunks.push(current.trim())
      current = ''
    }
    // En enkelt setning lengre enn grensen deles ved mellomrom
    let rest = sentence
    while (rest.length > chunkSize) {
      const cut = rest.lastIndexOf(' ', chunkSize)
      const index = cut > 0 ? cut : chunkSize
      chunks.push(rest.slice(0, index).trim())
      rest = rest.slice(index)
    }
    current += rest
  }
  if (current.trim()) {
    chunks.push(current.trim())
  }
  return chunks.filter(Boolean)
}

/** Kjører `fn` for hvert element med maks `concurrency` samtidig, og beholder rekkefølgen */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

/**
 * Genererer hele opplesningen som én MP3. Bitene genereres parallelt og settes
 * sammen i riktig rekkefølge. Feiler én bit (etter klientens egne forsøk på
 * nytt), feiler hele opplesningen – vi lagrer aldri halve artikler.
 */
export async function synthesize(
  openai: OpenAI,
  { text, voice, language }: { text: string; voice: Voice; language: string | null | undefined }
): Promise<Buffer> {
  const chunks = chunkText(text)
  if (chunks.length === 0) {
    throw new Error('Nothing to read aloud')
  }
  const instructions = getInstructions(language)
  const parts = await mapWithConcurrency(chunks, TTS_CONCURRENCY, async (input) => {
    const response = await openai.audio.speech.create({
      model: TTS_MODEL,
      voice,
      input,
      instructions,
      response_format: 'mp3',
    })
    return Buffer.from(await response.arrayBuffer())
  })
  // MP3 består av selvstendige rammer, så filene kan settes sammen direkte
  return Buffer.concat(parts)
}
