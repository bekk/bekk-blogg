import type { SanityClient } from '@sanity/client'
import type OpenAI from 'openai'
import { describe, expect, it } from 'vitest'

import {
  generatePostSummary,
  getSummarySourceHash,
  isSummaryEligible,
  SUMMARY_MIN_WORDS,
  type SummarySource,
} from './postSummary.server'
import { resolveShortSummary } from './shortSummary'
import { getSummaryInstructions } from './summarize'

const longText = 'ord '.repeat(SUMMARY_MIN_WORDS)

const source: SummarySource = {
  _id: 'post',
  title: 'Tittel',
  availableFrom: '2025-12-01',
  description: null,
  content: longText,
  language: 'nb-NO',
  hidden: null,
}

describe('resolveShortSummary', () => {
  const generated = { tldr: 'Generert.', audience: 'Utviklere', prerequisites: 'Litt React' }

  it('bruker det genererte når det ikke er overstyrt', () => {
    expect(resolveShortSummary({ summaryOverride: null, generatedSummary: generated })).toEqual({
      ...generated,
      isGenerated: true,
    })
  })

  it('lar hvert felt i overstyringen gå foran det genererte', () => {
    expect(
      resolveShortSummary({ summaryOverride: { tldr: ' Skrevet selv. ', audience: '' }, generatedSummary: generated })
    ).toEqual({ tldr: 'Skrevet selv.', audience: 'Utviklere', prerequisites: 'Litt React', isGenerated: true })
  })

  it('er ikke merket som generert når alt er skrevet av redaksjonen', () => {
    expect(
      resolveShortSummary({
        summaryOverride: { tldr: 'Skrevet selv.', audience: 'Alle', prerequisites: 'Ingenting' },
        generatedSummary: generated,
      })?.isGenerated
    ).toBe(false)
  })

  it('gir null når det er skjult eller mangler', () => {
    expect(resolveShortSummary({ summaryOverride: { hide: true }, generatedSummary: generated })).toBeNull()
    expect(resolveShortSummary({ summaryOverride: { audience: 'Alle' }, generatedSummary: null })).toBeNull()
  })
})

describe('isSummaryEligible', () => {
  it('gjelder luke-datoer med lange nok artikler som ikke er skjult', () => {
    expect(isSummaryEligible(source, longText)).toBe(true)
    expect(isSummaryEligible({ ...source, availableFrom: '2018-12-24' }, longText)).toBe(true)
    expect(isSummaryEligible({ ...source, availableFrom: '2025-12-25' }, longText)).toBe(false)
    expect(isSummaryEligible({ ...source, availableFrom: null }, longText)).toBe(false)
    expect(isSummaryEligible({ ...source, hidden: true }, longText)).toBe(false)
    expect(isSummaryEligible(source, 'For kort.')).toBe(false)
  })
})

describe('getSummarySourceHash', () => {
  it('endres når teksten eller språket endres, men ikke av skjuling', () => {
    const hash = getSummarySourceHash(source, 'Tekst')
    expect(getSummarySourceHash({ ...source }, 'Tekst')).toBe(hash)
    expect(getSummarySourceHash(source, 'Tekst endret')).not.toBe(hash)
    expect(getSummarySourceHash({ ...source, language: 'nn-NO' }, 'Tekst')).not.toBe(hash)
    expect(getSummarySourceHash({ ...source, hidden: false }, 'Tekst')).toBe(hash)
  })
})

describe('getSummaryInstructions', () => {
  it('ber om svar på artikkelens språk', () => {
    expect(getSummaryInstructions('nn-NO')).toContain('nynorsk')
    expect(getSummaryInstructions('en-US')).toContain('English')
    expect(getSummaryInstructions(null)).toContain('norsk bokmål')
  })
})

const fakeOpenAI = (output: { tldr: string; audience: string; prerequisites: string }) =>
  ({ responses: { parse: async () => ({ output_parsed: output }) } }) as unknown as OpenAI

/** Sanity-klient der innlegget kan endres mellom kallene, og som husker hva som ble skrevet */
const fakeSanity = (posts: (SummarySource | null)[], stored: { sourceHash: string } | null = null) => {
  const written: Record<string, unknown>[] = []
  const deleted: string[] = []
  let postFetches = 0
  const sanity = {
    fetch: async (query: string) => {
      if (query.includes('_type == "post"')) {
        return posts[Math.min(postFetches++, posts.length - 1)]
      }
      if (query.startsWith('defined(')) {
        return stored !== null
      }
      return stored
    },
    createOrReplace: async (document: Record<string, unknown>) => {
      written.push(document)
    },
    delete: async (id: string) => {
      deleted.push(id)
    },
  } as unknown as SanityClient
  return { sanity, written, deleted }
}

describe('generatePostSummary', () => {
  const openai = fakeOpenAI({ tldr: ' Om luker. ', audience: 'Utviklere', prerequisites: '' })

  it('lagrer sammendraget med svak referanse til innlegget', async () => {
    const { sanity, written } = fakeSanity([source])
    expect(await generatePostSummary('post', { sanity, openai })).toEqual({
      status: 'generated',
      characters: expect.any(Number),
    })
    expect(written).toEqual([
      expect.objectContaining({
        _id: 'summary-post',
        _type: 'postSummary',
        post: { _type: 'reference', _ref: 'post', _weak: true },
        tldr: 'Om luker.',
        audience: 'Utviklere',
        prerequisites: null,
      }),
    ])
  })

  it('hopper over innlegg der teksten er uendret', async () => {
    const sourceHash = getSummarySourceHash(source, `Tittel\n\n${longText.trim()}`)
    const { sanity, written } = fakeSanity([source], { sourceHash })
    expect(await generatePostSummary('post', { sanity, openai })).toEqual({ status: 'unchanged' })
    expect(written).toEqual([])
  })

  it('kaster resultatet hvis innlegget ble endret underveis', async () => {
    const { sanity, written } = fakeSanity([source, { ...source, content: `${longText} mer` }])
    expect(await generatePostSummary('post', { sanity, openai })).toEqual({ status: 'stale' })
    expect(written).toEqual([])
  })

  it('fjerner sammendraget når redaksjonen skjuler det', async () => {
    const { sanity, deleted } = fakeSanity([{ ...source, hidden: true }], { sourceHash: 'gammel' })
    expect(await generatePostSummary('post', { sanity, openai })).toEqual({ status: 'removed' })
    expect(deleted).toEqual(['summary-post'])
  })
})
