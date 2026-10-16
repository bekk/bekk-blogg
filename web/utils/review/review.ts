import type OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { getSummaryLanguage } from '../summary/summarize'
import { BEKK_STIL_SKILL } from './bekkStilSkill'
import { REDAKTOR_SKILL } from './redaktorSkill'

export const REVIEW_MODEL = 'gpt-5.5'
export const REVIEW_REASONING_EFFORT = 'medium'

/** Flere punkter enn dette blir en vegg av kommentarer som ingen orker å lese */
export const MAX_REVIEW_ITEMS = 8

export const REVIEW_CATEGORIES = [
  'kode',
  'fakta',
  'struktur',
  'resonnement',
  'særpreg',
  'ingress',
  'språk',
  'typografi',
  'ai-lyd',
] as const

export type ReviewInput = {
  title: string | null
  /** Ingress og innhold som markdown, så modellen ser kodeblokker som kode */
  description: string
  content: string
  language: string | null
  /** Dagens dato, så modellen vet hvor gammel kunnskapen dens er i forhold */
  today: string
}

/** Antall ord i brødteksten, uten kodeblokker. Modeller teller ord dårlig, så vi gjør det selv. */
export function countWords(markdown: string) {
  return markdown
    .replace(/^```[\s\S]*?^```/gm, ' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length
}

/**
 * De interne skillene er skrevet for en samtale, men her får forfatteren
 * ett svar i Studio. Reglene foran skillene sier hvordan de skal tilpasses. Den
 * faste teksten står først, så OpenAI kan cache den.
 */
export function getReviewInstructions({ language, today }: Pick<ReviewInput, 'language' | 'today'>) {
  return `Du er redaktør for Bekk Christmas, julekalenderen til konsulentselskapet Bekk, med fagartikler om teknologi, design og strategi. En kollega har trykket «Be om tilbakemelding» på et utkast i Sanity Studio.

Under følger redaktør-skillen du skal jobbe etter, og «Bekk-stil: språk og typografi» som den viser til. Redaktør-skillen er skrevet for en samtale, men her er det ingen samtale. Disse reglene går foran skillen der de er uenige:
- Du kan ikke stille spørsmål eller vente på godkjenning. Forfatteren leser svaret ditt i Studio og retter selv.
- Lever bare modul 3 – kvalitetssikring. Ikke foreslå titler, ingress, åpning eller kuttplan; vurder dem heller som funn.
- Leveransen er feltene i svarformatet, ikke en markdown-tabell: «Funn» er items, «Kort helhetsvurdering» er summary, «Faktasjekkliste» er factChecks og «Forslag til neste steg» er nextStep.
- «Bekk-stil: språk og typografi» står i <bekk-stil> under. Du trenger ikke åpne den noe annet sted.
- Teksten er gjort om fra Sanity til markdown for deg, så overskrifter, fet skrift, lenker og kodeblokker i markdown er formatering, ikke markdown-rester. Flagg bare markdown-tegn som tydelig står som tekst.
- Er artikkelen på engelsk, gjelder ikke reglene om norsk typografi og bokmål. Bruk da vanlig engelsk typografi.
- Tersklene i Bekk-stil er antall forekomster i hele teksten før mønsteret er verdt et funn. Saml forekomster av samme mønster i ett funn.
- Artiklene er fagartikler, ofte med kode. Se også etter kodeeksempler som ikke kompilerer, har åpenbare feil, bruker API-er som ikke finnes, eller ikke henger sammen med teksten rundt.
- Kunnskapen din har en sluttdato, så skriv «sjekk om X fortsatt er siste versjon», ikke «X er utdatert».
- Antall ord i brødteksten er talt for deg og står i input. Bruk det tallet.

Svarformat:
- items: maks ${MAX_REVIEW_ITEMS} funn, de viktigste først. Har artikkelen lite å utsette på, gi færre.
  - category: én av ${REVIEW_CATEGORIES.join(', ')}. «ingress» gjelder både tittel og ingress.
  - quote: et kort, ordrett utdrag (maks 15 ord) fra teksten funnet gjelder, så forfatteren finner stedet. Tom streng bare hvis funnet gjelder hele teksten, som lengden.
  - comment: problemet og en konkret omskriving eller handling, i én til tre setninger.
  - severity: «viktig» for feil og ting som bør fikses før publisering, «forslag» for resten.
- summary: kort helhetsvurdering, 2–4 setninger om tekstens sterkeste side og viktigste svakhet.
- factChecks: påstander som må verifiseres. hasSource er true hvis påstanden kan kontrolleres i en kilde som er oppgitt i teksten, og false hvis kilden mangler. Tom liste hvis ingenting må sjekkes.
- nextStep: én anbefaling, f.eks. «Rett funn 1–4 først».
- Vær direkte og vennlig, som en erfaren kollega.

<skill>
${REDAKTOR_SKILL}
</skill>

<bekk-stil>
${BEKK_STIL_SKILL}
</bekk-stil>

Svar på ${getSummaryLanguage(language)}, samme språk som artikkelen. Dagens dato er ${today}.`
}

export function getReviewInput({
  title,
  description,
  content,
}: Pick<ReviewInput, 'title' | 'description' | 'content'>) {
  return `<tittel>${title ?? '(uten tittel)'}</tittel>

<ingress>
${description}
</ingress>

<brødtekst ord="${countWords(content)}">
${content}
</brødtekst>`
}

const ReviewSchema = z.object({
  summary: z.string(),
  items: z.array(
    z.object({
      category: z.enum(REVIEW_CATEGORIES),
      severity: z.enum(['viktig', 'forslag']),
      quote: z.string(),
      comment: z.string(),
    })
  ),
  factChecks: z.array(z.object({ claim: z.string(), hasSource: z.boolean() })),
  nextStep: z.string(),
})

export type GeneratedReview = z.infer<typeof ReviewSchema>

export async function reviewPost(openai: OpenAI, input: ReviewInput): Promise<GeneratedReview> {
  const response = await openai.responses.parse({
    model: REVIEW_MODEL,
    reasoning: { effort: REVIEW_REASONING_EFFORT },
    instructions: getReviewInstructions(input),
    input: getReviewInput(input),
    text: { format: zodTextFormat(ReviewSchema, 'review') },
  })
  const parsed = response.output_parsed
  if (!parsed?.summary.trim()) {
    throw new Error('Got an empty review from OpenAI')
  }
  return {
    summary: parsed.summary.trim(),
    items: parsed.items.slice(0, MAX_REVIEW_ITEMS).map((item) => ({
      ...item,
      quote: item.quote.trim(),
      comment: item.comment.trim(),
    })),
    factChecks: parsed.factChecks
      .map((check) => ({ ...check, claim: check.claim.trim() }))
      .filter((check) => check.claim),
    nextStep: parsed.nextStep.trim(),
  }
}
