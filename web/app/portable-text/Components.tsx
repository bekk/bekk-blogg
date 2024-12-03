import React from 'react'
import type { PortableTextMarkComponentProps, PortableTextReactComponents } from '@portabletext/react'
import { PortableTextLink } from '@portabletext/types'
import { cleanControlCharacters } from 'utils/controlCharacters'

import {
  Code,
  CodePen,
  CodeSandbox,
  ImageWithMetadata,
  InfoBlock as InfoBlockType,
  PortableText,
  Quote,
  Twitter,
  UnfurledUrl,
  Youtube,
} from '../../utils/sanity/types/sanity.types'

import { CodeBlock } from './CodeBlock'
import { CodePenBlock } from './CodePenBlock'
import { CodeSandboxBlock } from './CodeSandboxBlock'
import ImageBlock from './ImageBlock'
import { InfoBlock } from './InfoBlock'
import { QuoteBlock } from './Quote'
import TwitterBlock from './TwitterBlock'
import { UnfurledUrlBlock } from './UnfurledUrlBlock'
import { YouTubeBlock } from './YouTubeBlock'

import { TextLink } from '~/components/TextLink'

const withSpacing = (component: React.ReactNode, margin: number = 2) => {
  return <div style={{ marginTop: `${margin}rem`, marginBottom: `${margin}rem` }}>{component}</div>
}

export const components: Partial<PortableTextReactComponents> = {
  types: {
    code: (props: { value: Code }) => withSpacing(<CodeBlock code={props.value} />),
    imageWithMetadata: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    codeSandbox: (props: { value: CodeSandbox }) => withSpacing(<CodeSandboxBlock codeSandbox={props.value} />),
    codePen: (props: { value: CodePen }) => withSpacing(<CodePenBlock codePen={props.value} />),
    youtube: (props: { value: Youtube }) => withSpacing(<YouTubeBlock youtube={props.value} />),
    twitter: (props: { value: Twitter }) => withSpacing(<TwitterBlock twitter={props.value} />),
    unfurledUrl: (props: { value: UnfurledUrl }) => withSpacing(<UnfurledUrlBlock unfurledUrl={props.value} />),
    iframe: () => null, // TODO: Implement iframe
    image: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    infoBlock: (props: { value: InfoBlockType }) =>
      withSpacing(<InfoBlock content={props.value.content as PortableText} />),
    quote: (props: { value: Quote }) =>
      withSpacing(<QuoteBlock quote={props.value.content} author={props.value.author} />),
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="mb-6 mt-12 leading-none">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="mb-6 mt-12">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="mb-6 mt-10">{children}</h3>,
    h4: ({ children }: { children?: React.ReactNode }) => <h4 className="mb-6 mt-10">{children}</h4>,
    normal: ({ children }: { children?: React.ReactNode }) => {
      const arrayChildren = React.Children.toArray(children)
      arrayChildren.forEach((segment) => cleanControlCharacters(segment.toString()))
      const regex = /[A-Za-z']+/gm
      const matches = [...arrayChildren.join('').matchAll(regex)]
      if (!arrayChildren.length || arrayChildren.join('') === '' || matches.length == 0) {
        return null
      }
      return <p className="mb-4 mt-6">{arrayChildren}</p>
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-inside list-disc [&>li>ul]:ml-6 [&>li>ol]:ml-6">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 list-inside list-decimal [&>li>ul]:ml-6 [&>li>ol]:ml-6 [&>li>ol]:list-[lower-alpha]">
        {children}
      </ol>
    ),
  },
  listItem: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  marks: {
    link: (props: PortableTextMarkComponentProps<PortableTextLink>) => {
      return <TextLink href={props.value?.href}>{props.children}</TextLink>
    },
    code: (props: PortableTextMarkComponentProps) => (
      <code className="bg-light-gray text-base p-1">{props.children}</code>
    ),
  },
}
