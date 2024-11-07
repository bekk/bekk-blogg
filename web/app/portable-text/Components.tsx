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
    iframe: () => <p>FILL IN</p>,
    image: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    infoBlock: (props: { value: InfoBlockType }) => <InfoBlock content={props.value.content as PortableText} />,
    Image: (props: { value: ImageWithMetadata }) => withSpacing(<ImageBlock image={props.value} />),
    // __block: <p>FILL IN</p>,
  },

  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-6 list-inside list-disc">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-6 list-inside list-decimal">{children}</ul>
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
