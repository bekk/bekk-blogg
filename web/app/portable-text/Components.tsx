import React from 'react'
import type { PortableTextReactComponents } from '@portabletext/react'

import {
  Code,
  CodePen,
  CodeSandbox,
  ImageWithMetadata,
  InfoBlock as InfoBlockType,
  PortableText,
  Twitter,
  UnfurledUrl,
  Youtube,
} from '../../utils/sanity/types/sanity.types'

import { CodeBlock } from './CodeBlock'
import { CodePenBlock } from './CodePenBlock'
import { CodeSandboxBlock } from './CodeSandboxBlock'
import ImageBlock from './ImageBlock'
import { InfoBlock } from './InfoBlock'
import TwitterBlock from './TwitterBlock'
import { UnfurledUrlBlock } from './UnfurledUrlBlock'
import { YouTubeBlock } from './YouTubeBlock'

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
    iframe: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    image: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    infoBlock: (props: { value: InfoBlockType }) =>
      withSpacing(<InfoBlock content={props.value.content as PortableText} />),
    Image: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="mt-4 mb-2">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="mt-4 mb-2">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="mt-4 mb-2">{children}</h3>,
    h4: ({ children }: { children?: React.ReactNode }) => <h4 className="mt-4 mb-2">{children}</h4>,
    normal: ({ children }: { children?: React.ReactNode }) => {
      const arrayChildren = React.Children.toArray(children)
      if (!arrayChildren.length || arrayChildren.join('') === '') {
        return null
      }
      return <p className="mb-4">{children}</p>
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-inside list-disc">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-inside list-decimal">{children}</ul>
    ),
  },
  listItem: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  // marks: {
  //   link: (props: any) => (
  //     <TextLink href={props.mark.href}>{props.children}</TextLink>
  //   ),
  //   code: Code,
  // },
}
