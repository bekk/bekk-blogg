import { describe, expect, it } from 'vitest'

import { classifyLinkResult, extractLinks } from './links'
import { getReviewDecision, getReviewDocumentId } from './postReview.server'
import { countWords, getReviewInput, getReviewInstructions } from './review'

describe('getReviewDocumentId', () => {
  it('bruker samme private id for utkast og publisert innlegg', () => {
    expect(getReviewDocumentId('drafts.abc')).toBe('review.abc')
    expect(getReviewDocumentId('abc')).toBe('review.abc')
  })
})

describe('getReviewDecision', () => {
  const requested = '2026-10-15T10:00:00.000Z'

  it('svarer på nye forespørsler', () => {
    expect(getReviewDecision(requested, requested, null)).toBe('review')
    expect(getReviewDecision(requested, requested, '2026-10-14T10:00:00.000Z')).toBe('review')
  })

  it('svarer ikke to ganger på samme forespørsel', () => {
    expect(getReviewDecision(requested, requested, requested)).toBe('already-reviewed')
    expect(getReviewDecision(requested, requested, '2026-10-16T10:00:00.000Z')).toBe('already-reviewed')
  })

  it('hopper over forespørsler som er erstattet eller mangler', () => {
    expect(getReviewDecision(requested, '2026-10-15T11:00:00.000Z', null)).toBe('stale')
    expect(getReviewDecision(null, requested, null)).toBe('stale')
  })
})

describe('extractLinks', () => {
  it('finner unike lenker i teksten og blant de relevante lenkene', () => {
    const markdown =
      'Les [dokumentasjonen](https://react.dev/learn) og [igjen](https://react.dev/learn). [Lokal](/post/2024)'
    expect(
      extractLinks(markdown, [{ url: 'https://example.com' }, { url: null }, null, { url: 'mailto:a@b.no' }])
    ).toEqual(['https://react.dev/learn', 'https://example.com'])
  })
})

describe('classifyLinkResult', () => {
  it('regner bare sikre feil som døde lenker', () => {
    expect(classifyLinkResult({ status: 404 })).toBe('HTTP 404')
    expect(classifyLinkResult({ status: 410 })).toBe('HTTP 410')
    expect(classifyLinkResult({ status: 403 })).toBeNull()
    expect(classifyLinkResult({ status: 200 })).toBeNull()
    expect(classifyLinkResult({ error: { cause: { code: 'ENOTFOUND' } } })).toBe('Fikk ikke kontakt (ENOTFOUND)')
    expect(classifyLinkResult({ error: new Error('timeout') })).toBeNull()
  })
})

describe('getReviewInstructions', () => {
  it('svarer på artikkelens språk og kjenner dagens dato', () => {
    expect(getReviewInstructions({ language: 'en-US', today: '2026-10-15' })).toContain('Svar på English')
    expect(getReviewInstructions({ language: null, today: '2026-10-15' })).toContain('Dagens dato er 2026-10-15')
  })

  it('tar med begge skillene', () => {
    const instructions = getReviewInstructions({ language: null, today: '2026-10-15' })
    expect(instructions).toContain('### Modul 3 – kvalitetssikring')
    expect(instructions).toContain('## Norsk typografi')
  })
})

describe('countWords', () => {
  it('teller ord i brødteksten, men ikke kode eller tegnsetting', () => {
    expect(countWords('Hei på deg – dette er *fem* ord.\n\n```ts\nconst a = 1\n```\n\n## Slutt')).toBe(8)
  })
})

describe('getReviewInput', () => {
  it('skiller tittel, ingress og brødtekst og oppgir antall ord', () => {
    const input = getReviewInput({ title: null, description: 'Kort ingress', content: 'To ord' })
    expect(input).toContain('<tittel>(uten tittel)</tittel>')
    expect(input).toContain('<ingress>\nKort ingress\n</ingress>')
    expect(input).toContain('<brødtekst ord="2">')
  })
})
