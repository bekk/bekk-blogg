// «Kort fortalt»: slår sammen det genererte sammendraget med redaksjonens
// overstyring, så artikkelsiden og markdown-versjonen alltid viser det samme.

type SummaryFields = { tldr?: string | null; audience?: string | null; prerequisites?: string | null }

export type ShortSummary = {
  tldr: string
  audience: string | null
  prerequisites: string | null
  /** Om noe av det som vises er generert, og ikke skrevet av redaksjonen */
  isGenerated: boolean
}

const textOf = (value: string | null | undefined) => value?.trim() || null

/**
 * Hvert felt i overstyringen går foran det genererte. Uten sammendrag, eller når
 * redaksjonen har skjult det, gir den `null`.
 */
export function resolveShortSummary(post: {
  summaryOverride?: (SummaryFields & { hide?: boolean | null }) | null
  generatedSummary?: SummaryFields | null
}): ShortSummary | null {
  const { summaryOverride: override, generatedSummary: generated } = post
  if (override?.hide) {
    return null
  }
  let isGenerated = false
  const pick = (field: keyof SummaryFields) => {
    const value = textOf(override?.[field])
    if (value) {
      return value
    }
    const generatedValue = textOf(generated?.[field])
    isGenerated ||= Boolean(generatedValue)
    return generatedValue
  }
  const tldr = pick('tldr')
  if (!tldr) {
    return null
  }
  return { tldr, audience: pick('audience'), prerequisites: pick('prerequisites'), isGenerated }
}

const labels = {
  'nb-NO': {
    title: 'Kort fortalt',
    audience: 'Passer for',
    prerequisites: 'Fint å kunne fra før',
    generated: 'Generert med KI',
  },
  'nn-NO': {
    title: 'Kort fortalt',
    audience: 'Passar for',
    prerequisites: 'Fint å kunne frå før',
    generated: 'Generert med KI',
  },
  'en-US': {
    title: 'In short',
    audience: 'For',
    prerequisites: 'Good to know beforehand',
    generated: 'AI-generated',
  },
}

export const getShortSummaryLabels = (language: string | null | undefined) =>
  labels[(language ?? 'nb-NO') as keyof typeof labels] ?? labels['nb-NO']
