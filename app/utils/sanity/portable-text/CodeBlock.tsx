import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {Code} from "../types/sanity.types";

export const CodeBlock = ({code}: {code: Code}) => {

  if (!code?.code) {
    return <p>Hmmm, ingen kode her</p>;
  }
  return (
      <SyntaxHighlighter language={code.language ?? "text"}>
        {code.code}
      </SyntaxHighlighter>
  );
};
