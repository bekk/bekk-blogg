import React from 'react'

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

export const components = {
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
  list: (props: { value: { listItem: 'number' | 'bullet' }; children: React.ReactNode }) => {
    return props.value.listItem === 'number' ? (
      <ol className={'mt-6 list-inside list-decimal'}>{props.children}</ol>
    ) : (
      <ul className={'mt-6 list-inside list-disc'}>{props.children}</ul>
    )
  },
  listItem: (props: { children: React.ReactNode }) => <li>{props.children}</li>,
  // marks: {
  //   link: (props: any) => (
  //     <TextLink href={props.mark.href}>{props.children}</TextLink>
  //   ),
  //   code: Code,
  // },
}
