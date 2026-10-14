/**
 * Forhåndsgenererer opplesninger av artikler og lagrer dem i Sanity.
 *
 * Kjører som tørrkjøring med mindre `--execute` er satt: lister artiklene, hva som
 * må genereres og hva det omtrent vil koste. Artikler der teksten er uendret siden
 * forrige generering hoppes over, så skriptet kan stoppes og startes på nytt.
 *
 *   npm run audio:generate                        # tørrkjøring for alt fra 2023
 *   npm run audio:generate -- --execute --limit 5 # generer de fem første
 *   npm run audio:generate -- --only <post-id> --out-dir ./tmp-audio  # til lokal fil, uten Sanity
 *
 * Krever SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_WRITE_API_TOKEN og OPENAI_API_KEY.
 */
import { createClient } from '@sanity/client'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import OpenAI from 'openai'
import { AUDIO_FROM_DATE, fetchAudioSource, generatePostAudio, isAudioEligible } from 'utils/tts/postAudio.server'
import { getSpokenText, mapWithConcurrency, resolveVoice, synthesize } from 'utils/tts/synthesize'

/** OpenAI anslår ca. $0,015 per minutt lyd, og ca. 1000 tegn per minutt */
const ESTIMATED_DOLLARS_PER_CHARACTER = 0.015 / 1000

const { values: args } = parseArgs({
  options: {
    from: { type: 'string', default: AUDIO_FROM_DATE },
    only: { type: 'string' },
    limit: { type: 'string' },
    concurrency: { type: 'string', default: '2' },
    'max-errors': { type: 'string', default: '3' },
    'out-dir': { type: 'string' },
    execute: { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
  },
})

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    console.error(`Mangler ${name}`)
    process.exit(1)
  }
  return value
}

const sanity = createClient({
  projectId: requireEnv('SANITY_STUDIO_PROJECT_ID'),
  dataset: requireEnv('SANITY_STUDIO_DATASET'),
  token: requireEnv('SANITY_WRITE_API_TOKEN'),
  apiVersion: '2024-12-09',
  useCdn: false,
  perspective: 'published',
})
const openai = new OpenAI({ apiKey: requireEnv('OPENAI_API_KEY'), maxRetries: 4 })

type Candidate = { _id: string; title: string; availableFrom: string }

async function findCandidates(): Promise<Candidate[]> {
  if (args.only) {
    return sanity.fetch(`*[_type == "post" && _id == $id]{ _id, title, availableFrom }`, { id: args.only })
  }
  const posts = await sanity.fetch<Candidate[]>(
    `*[_type == "post" && type == "article" && availableFrom >= $from] | order(availableFrom asc) { _id, title, availableFrom }`,
    { from: args.from }
  )
  // Samme grense som webhooken: bare luke-datoer fra og med AUDIO_FROM_DATE
  return posts.filter((post) => isAudioEligible(post.availableFrom))
}

/** Lager lydfila lokalt, uten å skrive noe til Sanity. For å lytte før man kjører på ordentlig. */
async function generateToFile(postId: string, outDir: string) {
  const source = await fetchAudioSource(sanity, postId)
  if (!source) {
    throw new Error(`Fant ingen publisert artikkel med id ${postId}`)
  }
  const text = getSpokenText(source)
  const voice = await resolveVoice(openai, { authorName: source.authorName, preferredVoice: source.preferredVoice })
  const audio = await synthesize(openai, { text, voice, language: source.language })
  await mkdir(outDir, { recursive: true })
  const file = join(outDir, `${source.slug ?? postId}.mp3`)
  await writeFile(file, audio)
  console.log(`Skrev ${file} (${text.length} tegn, ${(audio.length / 1e6).toFixed(1)} MB, stemme ${voice})`)
}

async function main() {
  const candidates = (await findCandidates()).slice(0, args.limit ? Number(args.limit) : undefined)

  if (args['out-dir']) {
    for (const post of candidates) {
      await generateToFile(post._id, args['out-dir'])
    }
    return
  }

  const dryRun = !args.execute
  const maxErrors = Number(args['max-errors'])
  let errors = 0
  let charactersToGenerate = 0
  let generated = 0

  console.log(
    `${dryRun ? 'Tørrkjøring' : 'Genererer'}: ${candidates.length} artikler${args.only ? '' : ` fra ${args.from}`}\n`
  )

  await mapWithConcurrency(candidates, Number(args.concurrency), async (post) => {
    if (errors >= maxErrors) {
      return
    }
    const label = `${post.availableFrom} ${post.title}`
    try {
      const started = Date.now()
      const result = await generatePostAudio(post._id, { sanity, openai, force: args.force, dryRun })
      switch (result.status) {
        case 'dry-run':
          charactersToGenerate += result.characters
          console.log(`  må genereres  ${label} (${result.characters} tegn)`)
          break
        case 'generated':
          charactersToGenerate += result.characters
          generated++
          console.log(
            `  ✓ generert    ${label} (${result.characters} tegn, ${(result.bytes / 1e6).toFixed(1)} MB, ` +
              `${result.voice}, ${Math.round((Date.now() - started) / 1000)} s)`
          )
          break
        default:
          console.log(`  – ${result.status.padEnd(12)} ${label}`)
      }
    } catch (error) {
      errors++
      console.error(`  ✗ feilet      ${label}`, error instanceof Error ? error.message : error)
    }
  })

  const cost = (charactersToGenerate * ESTIMATED_DOLLARS_PER_CHARACTER).toFixed(2)
  console.log(
    dryRun
      ? `\n${charactersToGenerate} tegn må genereres, anslått kostnad ca. $${cost}. Kjør med --execute for å generere.`
      : `\nGenererte ${generated} opplesninger (${charactersToGenerate} tegn, anslått ca. $${cost}).`
  )
  if (errors > 0) {
    console.error(`${errors} feil${errors >= maxErrors ? ', stoppet etter for mange feil' : ''}.`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
