import type OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'

/**
 * Alt som påvirker sammendraget, og som derfor inngår i hashen. Endrer du noe
 * her som skal gi nye sammendrag for alle artikler, øk `SUMMARY_VERSION`.
 */
export const SUMMARY_VERSION = 1
export const SUMMARY_MODEL = 'gpt-5.4-mini'
/** Med lav innsats ignorerte modellen instruksen om å skrive om temaet, ikke om teksten */
export const SUMMARY_REASONING_EFFORT = 'medium'

const LANGUAGE_NAMES: Record<string, string> = {
  'nb-NO': 'norsk bokmål',
  'nn-NO': 'nynorsk',
  'en-US': 'English',
}

export const getSummaryLanguage = (language: string | null | undefined) =>
  LANGUAGE_NAMES[language ?? 'nb-NO'] ?? LANGUAGE_NAMES['nb-NO']

export function getSummaryInstructions(language: string | null | undefined) {
  return `Du lager en kort oppsummering av en fagartikkel fra Bekk Christmas, julekalenderen til konsulentselskapet Bekk. Oppsummeringen vises øverst i artikkelen, så leseren raskt kan avgjøre om den er noe for dem.

Svar på ${getSummaryLanguage(language)}, samme språk som artikkelen.

- tldr: To–tre setninger om hva artikkelen handler om og hva leseren sitter igjen med. Skriv om selve temaet, ikke om teksten: «Ports and Adapters isolerer domenet fra databasen …», ikke «Artikkelen beskriver hvordan …». Ikke gjenta tittelen.
- audience: Hvem artikkelen passer for, som en kort frase uten punktum, f.eks. «Frontendutviklere som bruker React».
- prerequisites: Hva det er fint å kunne fra før, som en kort frase uten punktum. Tom streng hvis artikkelen ikke krever noen spesielle forkunnskaper.

Hold deg til det som står i artikkelen. Ikke legg til fakta, vurderinger eller anbefalinger som ikke står der.`
}

const SummarySchema = z.object({
  tldr: z.string(),
  audience: z.string(),
  prerequisites: z.string(),
})

export type GeneratedSummary = { tldr: string; audience: string | null; prerequisites: string | null }

/** Lager sammendraget med strukturert output, så vi alltid får de tre feltene */
export async function summarize(
  openai: OpenAI,
  { text, language }: { text: string; language: string | null | undefined }
): Promise<GeneratedSummary> {
  const response = await openai.responses.parse({
    model: SUMMARY_MODEL,
    reasoning: { effort: SUMMARY_REASONING_EFFORT },
    instructions: getSummaryInstructions(language),
    input: text,
    text: { format: zodTextFormat(SummarySchema, 'summary') },
  })
  const parsed = response.output_parsed
  if (!parsed?.tldr.trim()) {
    throw new Error('Got an empty summary from OpenAI')
  }
  // Tomme strenger betyr at modellen ikke hadde noe å si, og lagres som null
  return {
    tldr: parsed.tldr.trim(),
    audience: parsed.audience.trim() || null,
    prerequisites: parsed.prerequisites.trim() || null,
  }
}
