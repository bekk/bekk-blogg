import {Code, CodePen, CodeSandbox, ImageWithMetadata, Twitter, UnfurledUrl, Youtube} from '../types/sanity.types'

import {CodeBlock} from './CodeBlock'
import {CodePenBlock} from './CodePenBlock'
import {CodeSandboxBlock} from './CodeSandboxBlock'
import ImageBlock from './ImageBlock'
import TwitterBlock from './TwitterBlock'
import {UnfurledUrlBlock} from './UnfurledUrlBlock'
import {YouTubeBlock} from './YouTubeBlock'

export const components = {
  types: {
    code: (props: { value: Code }) => <CodeBlock code={props.value}/>,
    imageWithMetadata: (props: { value: ImageWithMetadata }) => <ImageBlock image={props.value}/>,
    codeSandbox: (props: { value: CodeSandbox }) => <CodeSandboxBlock codeSandbox={props.value}/>,
    codePen: (props: { value: CodePen }) => <CodePenBlock codePen={props.value}/>,
    youtube: (props: { value: Youtube }) => <YouTubeBlock youtube={props.value}/>,
    twitter: (props: { value: Twitter }) => <TwitterBlock twitter={props.value}/>,
    unfurledUrl: (props: { value: UnfurledUrl }) => <UnfurledUrlBlock unfurledUrl={props.value}/>,
    iframe: (props: { value: ImageWithMetadata }) => <ImageBlock image={props.value}/>,
    image: (props: { value: ImageWithMetadata }) => <ImageBlock image={props.value}/>,
    infoBlock: () => <p>FILL IN</p>,
    Image: (props: { value: ImageWithMetadata }) => <ImageBlock image={props.value}/>,

    // __block: <p>FILL IN</p>,
  },
  // marks: {
  //   link: (props: any) => (
  //     <TextLink href={props.mark.href}>{props.children}</TextLink>
  //   ),
  //   code: Code,
  // },
  // list:
  //   withWrap()(
  //   (props: { type: "number" | "bullet"; children: React.ReactNode }) => {
  //     const ListComponent =
  //       props.type === "number" ? OrderedList : UnorderedList;
  //     return <ListComponent fontSize="xl">{props.children}</ListComponent>;
  //   },
  // ),
}
