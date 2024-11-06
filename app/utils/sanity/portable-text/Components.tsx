import {Code, CodePen, CodeSandbox, ImageWithMetadata, Twitter} from "../types/sanity.types";

import {CodeBlock} from "./CodeBlock";
import ImageWithMetadataBlock from "./ImageWithMetadataBlock";
import {CodePenBlock} from "./CodePenBlock";
import {CodeSandboxBlock} from "./CodeSandboxBlock";
import TwitterBlock from "./TwitterBlock";

export const components = {
  types: {
    code: (props: { value: Code }) => (
      <CodeBlock code={props.value}/>
    ),
    imageWithMetadata: (props: { value: ImageWithMetadata }) => (
      <ImageWithMetadataBlock image={props.value}/>
    ),
    codeSandbox: (props: { value: CodeSandbox }) => (
      <CodeSandboxBlock codeSandbox={props.value}/>
    ),
    codePen: (props: { value: CodePen }) => (
      <CodePenBlock codePen={props.value}/>
    ),
    youtube: () => (
      <p>FILL IN</p>
    ),
    twitter: (props: { value: Twitter}) => (
      <TwitterBlock twitter={props.value} />
    ),
    unfurledUrl: () => (
      <p>FILL IN</p>
    ),
    Image: () => (
      <p>FILL IN</p>
    ),
    iframe: () => (
      <p>FILL IN</p>
    ),
    image: () => (
      <p>FILL IN</p>
    ),
    infoBlock: () => (
      <p>FILL IN</p>
    ),
    // __block: <p>FILL IN</p>,
  }
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