import { describe, expect, it } from 'vitest'

import { portableTextToMarkdown, postToMarkdown } from './markdown'

const block = (text: string, extra: Record<string, unknown> = {}) => ({
  _type: 'block',
  _key: Math.random().toString(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: 's', text, marks: [] }],
  ...extra,
})

describe('portableTextToMarkdown', () => {
  it('gjør om overskrifter, avsnitt og sitater', () => {
    expect(
      portableTextToMarkdown([
        block('Tittel', { style: 'h2' }),
        block('Et avsnitt'),
        block('Et sitat\nover to linjer', { style: 'blockquote' }),
      ])
    ).toBe('## Tittel\n\nEt avsnitt\n\n> Et sitat\n> over to linjer')
  })

  it('escaper tekst som ellers ville blitt tolket som markdown-struktur', () => {
    expect(portableTextToMarkdown([block('* Fotnote'), block('2024. Et godt år\n# ikke overskrift')])).toBe(
      '\\* Fotnote\n\n2024\\. Et godt år\n\\# ikke overskrift'
    )
  })

  it('hopper over tomme avsnitt og ukjente blokker', () => {
    expect(portableTextToMarkdown([block('  ​ '), { _type: 'ukjent' }, block('Hei')])).toBe('Hei')
  })

  it('formaterer marks og lenker, og holder mellomrom utenfor markørene', () => {
    expect(
      portableTextToMarkdown([
        {
          _type: 'block',
          style: 'normal',
          markDefs: [{ _key: 'l1', _type: 'link', href: 'https://bekk.no' }],
          children: [
            { _type: 'span', text: 'Les ', marks: [] },
            { _type: 'span', text: 'fet ', marks: ['strong'] },
            { _type: 'span', text: 'og ', marks: ['l1'] },
            { _type: 'span', text: 'lenket', marks: ['l1', 'em'] },
            { _type: 'span', text: ' og ', marks: [] },
            { _type: 'span', text: 'a`b', marks: ['code'] },
            { _type: 'span', text: ' og ', marks: [] },
            { _type: 'span', text: 'gammelt', marks: ['strike-through'] },
          ],
        },
      ])
    ).toBe('Les **fet** [og _lenket_](https://bekk.no) og ``a`b`` og ~~gammelt~~')
  })

  it('gjør om nøstede lister med nummerering per nivå', () => {
    expect(
      portableTextToMarkdown([
        block('En', { listItem: 'number', level: 1 }),
        block('Under', { listItem: 'bullet', level: 2 }),
        block('Under igjen', { listItem: 'number', level: 2 }),
        block('To', { listItem: 'number', level: 1 }),
        block('Etter lista'),
      ])
    ).toBe('1. En\n    - Under\n    2. Under igjen\n2. To\n\nEtter lista')
  })

  it('bruker lengre gjerde når koden inneholder ```', () => {
    expect(
      portableTextToMarkdown([{ _type: 'code', language: 'markdown', filename: 'README.md', code: '```js\nx\n```\n' }])
    ).toBe('````markdown title="README.md"\n```js\nx\n```\n````')
  })

  it('dropper språk for ren tekst', () => {
    expect(portableTextToMarkdown([{ _type: 'code', language: 'text', code: 'hei' }])).toBe('```\nhei\n```')
  })

  it('gjør om bilder med alt-tekst og bildetekst', () => {
    expect(
      portableTextToMarkdown([
        { _type: 'imageWithMetadata', alt: 'En [nisse]', caption: 'Foto: Bekk', assetUrl: 'https://cdn/x.png' },
        { _type: 'imageWithMetadata', alt: 'Ekstern', src: 'https://ekstern/y.png' },
        { _type: 'imageWithMetadata', alt: 'Uten bilde' },
      ])
    ).toBe('![En nisse](https://cdn/x.png)\n_Foto: Bekk_\n\n![Ekstern](https://ekstern/y.png)')
  })

  it('gjør om tabeller, sitater, infobokser og innebygd innhold', () => {
    expect(
      portableTextToMarkdown([
        { _type: 'table', rows: [{ cells: ['A', 'B'] }, { cells: ['1 | 2'] }] },
        { _type: 'quote', content: 'Jul er best', author: 'Nissen' },
        { _type: 'infoBlock', content: [block('Viktig info')] },
        { _type: 'youtube', url: 'https://youtu.be/x' },
        { _type: 'unfurledUrl', url: 'https://bekk.no' },
        { _type: 'iframe', src: 'https://example.com' },
      ])
    ).toBe(
      [
        '| A | B |\n| --- | --- |\n| 1 \\| 2 |  |',
        '> Jul er best\n>\n> — Nissen',
        '> Viktig info',
        '[YouTube](https://youtu.be/x)',
        '<https://bekk.no>',
        '<https://example.com>',
      ].join('\n\n')
    )
  })

  it('tåler manglende innhold', () => {
    expect(portableTextToMarkdown(null)).toBe('')
    expect(portableTextToMarkdown(undefined)).toBe('')
  })
})

describe('postToMarkdown', () => {
  const post = {
    title: 'Min "luke"',
    slug: 'min-luke',
    type: 'podcast',
    language: 'nb-NO',
    embedUrl: 'https://podcast/1',
    podcastLength: 20,
    description: [block('Ingressen')],
    previewText: null,
    availableFrom: '2024-12-03',
    _updatedAt: '2024-12-04T10:00:00Z',
    canonicalUrl: null,
    keywords: null,
    authors: ['Ola Nordmann'],
    tags: ['Frontend'],
    series: null,
    relatedLinks: [{ _type: 'relatedLink', _key: 'r', title: 'Bekk', url: 'https://bekk.no', description: 'Hjem' }],
    content: [block('Brødtekst')],
  } as const

  it('lager et helt dokument med frontmatter', () => {
    expect(
      postToMarkdown(
        post as unknown as Parameters<typeof postToMarkdown>[0],
        'https://www.bekk.christmas/post/2024/03/min-luke'
      )
    ).toBe(
      [
        '---',
        'title: "Min \\"luke\\""',
        'url: "https://www.bekk.christmas/post/2024/03/min-luke"',
        'authors: ["Ola Nordmann"]',
        'published: "2024-12-03"',
        'updated: "2024-12-04T10:00:00Z"',
        'language: "nb-NO"',
        'type: "podcast"',
        'tags: ["Frontend"]',
        '---',
        '',
        '# Min "luke"',
        '',
        'Ingressen',
        '',
        '[Hør episoden](https://podcast/1)',
        '',
        'Brødtekst',
        '',
        '## Relevante lenker anbefalt av forfatteren',
        '',
        '- [Bekk](https://bekk.no): Hjem',
        '',
      ].join('\n')
    )
  })
})
