import {CodeBlock} from "./CodeBlock";
import {Code, ImageWithMetadata} from "../types/sanity.types";
import ImageWithMetadataBlock from "./ImageWithMetadataBlock";

export const components = {
  types: {
    code: (props: {value: Code}) => (
      <CodeBlock code={props.value} />
    ),
    imageWithMetadata: (props: {value: ImageWithMetadata}) => (
      <ImageWithMetadataBlock image={props.value} />
    )
  }
}