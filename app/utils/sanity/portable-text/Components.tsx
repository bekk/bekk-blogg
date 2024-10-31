import {CodeBlock} from "./CodeBlock";
import {Code} from "../types/sanity.types";

export const components = {
  types: {
    code: (props: {value: Code}) => (
      <CodeBlock code={props.value} />
    )
  }
}