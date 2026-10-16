import type OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { getSummaryLanguage } from '../summary/summarize'

export const REVIEW_MODEL = 'gpt-5.5'
export const REVIEW_REASONING_EFFORT = 'medium'

/** Flere punkter enn dette blir en vegg av kommentarer som ingen orker å lese */
export const MAX_REVIEW_ITEMS = 8

export const REVIEW_CATEGORIES = ['kode', 'fakta', 'struktur', 'ingress', 'språk'] as const

export type ReviewInput = {
  title: string | null
  /** Ingress og innhold som markdown, så modellen ser kodeblokker som kode */
  markdown: string
  language: string | null
  /** Dagens dato, så modellen vet hvor gammel kunnskapen dens er i forhold */
  today: string
}

export function getReviewInstructions({ language, today }: Pick<ReviewInput, 'language' | 'today'>) {
  return `Du er redaktør for Bekk Christmas, julekalenderen til konsulentselskapet Bekk, med fagartikler om teknologi, design og strategi. En kollega har bedt om tilbakemelding på et utkast. Du gir råd – du skriver ikke teksten om.

Svar på ${getSummaryLanguage(language)}, samme språk som artikkelen. Dagens dato er ${today}.

Se etter, i denne rekkefølgen:
- kode: kodeeksempler som ikke kompilerer, har åpenbare feil, bruker API-er som ikke finnes, eller ikke henger sammen med teksten rundt.
- fakta: påstander som ser feil ut, og versjoner eller verktøy som kan være utdatert. Kunnskapen din har en sluttdato, så skriv «sjekk om X fortsatt er siste versjon», ikke «X er utdatert».
- struktur: avsnitt som er for lange, rekkefølge som gjør det vanskelig å følge, eller en slutt som bare stopper.
- ingress: om tittelen og ingressen får leseren til å ville lese videre, og om de lover det artikkelen holder.
- språk: tunge setninger, gjentakelser, konsulentspråk og tekst som høres maskinskrevet ut. Ikke pirk på smak og stil.

Regler:
- Maks ${MAX_REVIEW_ITEMS} punkter. Ta bare med det som faktisk gjør artikkelen bedre, og de viktigste først. Har artikkelen lite å utsette på, gi færre punkter.
- quote: et kort, ordrett utdrag (maks 15 ord) fra teksten punktet gjelder, så forfatteren finner stedet. Tom streng hvis punktet gjelder hele teksten.
- comment: hva som er problemet og hva forfatteren kan gjøre, i én til tre setninger. Ikke skriv om hele avsnitt; et kort eksempel på en bedre formulering er greit.
- severity: «viktig» for feil og ting som bør fikses før publisering, «forslag» for resten.
- summary: helhetsinntrykket i to setninger, rett på sak.
- strengths: én eller to konkrete ting som fungerer godt. Ikke generisk ros.
- Vær direkte og vennlig, som en erfaren kollega. Ikke finn på problemer for å fylle opp listen.`
}

const ReviewSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  items: z.array(
    z.object({
      category: z.enum(REVIEW_CATEGORIES),
      severity: z.enum(['viktig', 'forslag']),
      quote: z.string(),
      comment: z.string(),
    })
  ),
})

export type GeneratedReview = z.infer<typeof ReviewSchema>

export async function reviewPost(openai: OpenAI, input: ReviewInput): Promise<GeneratedReview> {
  const response = await openai.responses.parse({
    model: REVIEW_MODEL,
    reasoning: { effort: REVIEW_REASONING_EFFORT },
    instructions: getReviewInstructions(input),
    input: `# ${input.title ?? '(uten tittel)'}\n\n${input.markdown}`,
    text: { format: zodTextFormat(ReviewSchema, 'review') },
  })
  const parsed = response.output_parsed
  if (!parsed?.summary.trim()) {
    throw new Error('Got an empty review from OpenAI')
  }
  return {
    summary: parsed.summary.trim(),
    strengths: parsed.strengths.map((strength) => strength.trim()).filter(Boolean),
    items: parsed.items.slice(0, MAX_REVIEW_ITEMS).map((item) => ({
      ...item,
      quote: item.quote.trim(),
      comment: item.comment.trim(),
    })),
  }
}
