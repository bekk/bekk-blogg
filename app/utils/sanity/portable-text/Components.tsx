import {CodeBlock} from "./CodeBlock";
import {Code, ImageWithMetadata} from "../types/sanity.types";
import ImageWithMetadataBlock from "./ImageWithMetadataBlock";

export const components = {
  types: {
    code: (props: { value: Code }) => (
      <CodeBlock code={props.value}/>
    ),
    imageWithMetadata: (props: { value: ImageWithMetadata }) => (
      <ImageWithMetadataBlock image={props.value}/>
    ),
    codeSandbox: <p>FILL IN</p>,
    codePen: <p>FILL IN</p>,
    youtube: <p>FILL IN</p>,
    twitter: <p>FILL IN</p>,
    unfurledUrl: <p>FILL IN</p>,
    mainImage: <p>FILL IN</p>,
    iframe: <p>FILL IN</p>,
    image: <p>FILL IN</p>,
    infoBlock: <p>FILL IN</p>,
    __block: <p>FILL IN</p>,
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