/**
 * Genererer «Kort fortalt» for artikler og lagrer det i Sanity.
 *
 * Kjører som tørrkjøring med mindre `--execute` er satt: lister artiklene, hva som
 * må genereres og omtrent hvor mange tokens det blir. Artikler der teksten er
 * uendret siden forrige generering hoppes over, så skriptet kan stoppes og startes
 * på nytt.
 *
 *   npm run summary:generate                        # tørrkjøring for hele arkivet
 *   npm run summary:generate -- --execute --limit 5 # generer de fem første
 *   npm run summary:generate -- --only <post-id> --print  # skriv ut, uten Sanity
 *
 * Krever SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_WRITE_API_TOKEN og OPENAI_API_KEY.
 */
import { createClient } from '@sanity/client'
import { parseArgs } from 'node:util'
import OpenAI from 'openai'
import { generatePostSummary } from 'utils/summary/postSummary.server'
import { summarize, SUMMARY_MODEL } from 'utils/summary/summarize'
import { getSpokenText, mapWithConcurrency } from 'utils/tts/synthesize'

/** Grovt anslag for norsk og engelsk tekst */
const CHARACTERS_PER_TOKEN = 4

const { values: args } = parseArgs({
  options: {
    from: { type: 'string', default: '2000-01-01' },
    only: { type: 'string' },
    limit: { type: 'string' },
    concurrency: { type: 'string', default: '4' },
    'max-errors': { type: 'string', default: '3' },
    print: { type: 'boolean', default: false },
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

function findCandidates(): Promise<Candidate[]> {
  if (args.only) {
    return sanity.fetch(`*[_type == "post" && _id == $id]{ _id, title, availableFrom }`, { id: args.only })
  }
  // Datogrensa og lengdekravet sjekkes i generatePostSummary, så skriptet og webhooken er enige
  return sanity.fetch(
    `*[_type == "post" && type == "article" && availableFrom >= $from] | order(availableFrom asc) { _id, title, availableFrom }`,
    { from: args.from }
  )
}

/** Skriver sammendraget til terminalen, uten å lagre noe. For å se på resultatet før man kjører på ordentlig. */
async function printSummary(postId: string) {
  const source = await sanity.fetch<{ title: string; description: string; content: string; language: string } | null>(
    `*[_type == "post" && _id == $id][0]{ title, "description": pt::text(description), "content": pt::text(content), language }`,
    { id: postId }
  )
  if (!source) {
    throw new Error(`Fant ingen publisert artikkel med id ${postId}`)
  }
  const summary = await summarize(openai, { text: getSpokenText(source), language: source.language })
  console.log(`${source.title}\n`)
  console.log(summary.tldr)
  console.log(`\nPasser for: ${summary.audience ?? '–'}\nForkunnskaper: ${summary.prerequisites ?? '–'}\n`)
}

async function main() {
  const candidates = (await findCandidates()).slice(0, args.limit ? Number(args.limit) : undefined)

  if (args.print) {
    for (const post of candidates) {
      await printSummary(post._id)
    }
    return
  }

  const dryRun = !args.execute
  const maxErrors = Number(args['max-errors'])
  let errors = 0
  let charactersToGenerate = 0
  let generated = 0

  console.log(`${dryRun ? 'Tørrkjøring' : 'Genererer'} med ${SUMMARY_MODEL}: ${candidates.length} artikler\n`)

  await mapWithConcurrency(candidates, Number(args.concurrency), async (post) => {
    if (errors >= maxErrors) {
      return
    }
    const label = `${post.availableFrom} ${post.title}`
    try {
      const result = await generatePostSummary(post._id, { sanity, openai, force: args.force, dryRun })
      switch (result.status) {
        case 'dry-run':
          charactersToGenerate += result.characters
          console.log(`  må genereres  ${label} (${result.characters} tegn)`)
          break
        case 'generated':
          charactersToGenerate += result.characters
          generated++
          console.log(`  ✓ generert    ${label}`)
          break
        default:
          console.log(`  – ${result.status.padEnd(12)} ${label}`)
      }
    } catch (error) {
      errors++
      console.error(`  ✗ feilet      ${label}`, error instanceof Error ? error.message : error)
    }
  })

  const tokens = Math.round(charactersToGenerate / CHARACTERS_PER_TOKEN).toLocaleString('nb-NO')
  console.log(
    dryRun
      ? `\nCa. ${tokens} input-tokens må sendes til ${SUMMARY_MODEL}. Kjør med --execute for å generere.`
      : `\nGenererte ${generated} sammendrag (ca. ${tokens} input-tokens).`
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
