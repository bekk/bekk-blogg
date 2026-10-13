import type OpenAI from 'openai'
import { describe, expect, it } from 'vitest'

import { getSourceHash, isAudioEligible } from './postAudio.server'
import { chunkText, getSpokenText, mapWithConcurrency, synthesize, withRetries } from './synthesize'

describe('getSpokenText', () => {
  it('fjerner usynlige tegn, men beholder avsnitt', () => {
    const text = getSpokenText({
      title: 'Tit\u200Btel',
      description: 'Ingress',
      content: 'Overskrift\n\nFørste\u00A0setning.',
    })
    expect(text).toBe('Tittel\n\nIngress\n\nOverskrift\n\nFørste setning.')
  })

  it('hopper over tomme felt', () => {
    expect(getSpokenText({ title: 'Tittel', description: null, content: '' })).toBe('Tittel')
  })
})

describe('chunkText', () => {
  it('beholder tegnsetting og deler ved setninger', () => {
    expect(chunkText('Hei! Hva skjer? Dette er en test. Og en til', 20)).toEqual([
      'Hei! Hva skjer?',
      'Dette er en test.',
      'Og en til',
    ])
  })

  it('holder overskrifter uten punktum adskilt fra neste avsnitt', () => {
    const chunks = chunkText('Overskrift\n\nFørste setning.', 1500)
    expect(chunks).toEqual(['Overskrift\n\nFørste setning.'])
    expect(chunks[0]).not.toContain('OverskriftFørste')
  })

  it('deler setninger som er lengre enn grensen ved mellomrom', () => {
    const chunks = chunkText(`${'ord '.repeat(10)}slutt.`, 20)
    expect(chunks.every((chunk) => chunk.length <= 20)).toBe(true)
    expect(chunks.join(' ').replace(/\s+/g, ' ')).toBe(`${'ord '.repeat(10)}slutt.`)
  })

  it('mister ingen tekst', () => {
    const text = 'En. To? Tre!\n\nFire fem seks. Sju'
    expect(chunkText(text, 10).join(' ').replace(/\s+/g, ' ')).toBe(text.replace(/\s+/g, ' '))
  })
})

describe('mapWithConcurrency', () => {
  it('beholder rekkefølgen og respekterer grensen', async () => {
    let running = 0
    let maxRunning = 0
    const result = await mapWithConcurrency([30, 10, 20, 5], 2, async (delay, index) => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await new Promise((resolve) => setTimeout(resolve, delay))
      running--
      return index
    })
    expect(result).toEqual([0, 1, 2, 3])
    expect(maxRunning).toBe(2)
  })
})

const fakeOpenAI = (speak: (input: string) => Promise<string>) =>
  ({
    audio: {
      speech: {
        create: async ({ input }: { input: string }) => {
          const audio = await speak(input)
          return { arrayBuffer: async () => new TextEncoder().encode(audio).buffer }
        },
      },
    },
  }) as unknown as OpenAI

describe('synthesize', () => {
  it('setter sammen bitene i riktig rekkefølge selv om de blir ferdige i feil rekkefølge', async () => {
    const text = Array.from({ length: 6 }, (_, i) => `Setning nummer ${i} ${'x'.repeat(1400)}.`).join(' ')
    const openai = fakeOpenAI(async (input) => {
      const number = input.match(/nummer (\d)/)![1]
      await new Promise((resolve) => setTimeout(resolve, (6 - Number(number)) * 5))
      return `[${number}]`
    })
    const audio = await synthesize(openai, { text, voice: 'marin', language: 'nb-NO' })
    expect(audio.toString()).toBe('[0][1][2][3][4][5]')
  })

  it('feiler hele opplesningen hvis én bit feiler', async () => {
    const text = `Første. ${'x'.repeat(1600)}. Siste.`
    const openai = fakeOpenAI(async (input) => {
      if (input.includes('Siste')) throw new Error('OpenAI er nede')
      return 'lyd'
    })
    await expect(synthesize(openai, { text, voice: 'marin', language: 'nb-NO', retryDelayMs: 1 })).rejects.toThrow(
      'OpenAI er nede'
    )
  })
})

describe('getSourceHash', () => {
  const source = {
    _id: 'post',
    title: 'Tittel',
    slug: 'tittel',
    availableFrom: '2025-12-01',
    description: null,
    content: 'Innhold.',
    language: 'nb-NO',
    authorName: 'Kari Nordmann',
    preferredVoice: null,
  }

  it('er stabil for samme innhold', () => {
    expect(getSourceHash(source, 'Tekst')).toBe(getSourceHash({ ...source }, 'Tekst'))
  })

  it('endres når teksten, språket eller stemmevalget endres', () => {
    const hash = getSourceHash(source, 'Tekst')
    expect(getSourceHash(source, 'Tekst endret')).not.toBe(hash)
    expect(getSourceHash({ ...source, language: 'en-US' }, 'Tekst')).not.toBe(hash)
    expect(getSourceHash({ ...source, preferredVoice: 'onyx' }, 'Tekst')).not.toBe(hash)
  })

  it('påvirkes ikke av felt som ikke leses opp', () => {
    expect(getSourceHash({ ...source, slug: 'ny-slug' }, 'Tekst')).toBe(getSourceHash(source, 'Tekst'))
  })
})

describe('isAudioEligible', () => {
  it('gjelder bare luke-datoer fra og med 2024', () => {
    expect(isAudioEligible('2025-12-01')).toBe(true)
    expect(isAudioEligible('2026-12-24')).toBe(true)
    expect(isAudioEligible('2024-12-24')).toBe(true)
    expect(isAudioEligible('2023-12-24')).toBe(false)
    expect(isAudioEligible('2025-12-25')).toBe(false)
    expect(isAudioEligible(null)).toBe(false)
  })
})

describe('withRetries', () => {
  it('prøver på nytt til det lykkes', async () => {
    let calls = 0
    const result = await withRetries(
      async () => {
        calls++
        if (calls < 3) throw new Error('terminated')
        return 'ok'
      },
      3,
      1
    )
    expect(result).toBe('ok')
    expect(calls).toBe(3)
  })

  it('gir opp etter siste forsøk', async () => {
    await expect(withRetries(async () => Promise.reject(new Error('terminated')), 2, 1)).rejects.toThrow('terminated')
  })
})
