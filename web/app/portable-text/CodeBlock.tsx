import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { Code } from '../../utils/sanity/types/sanity.types'

interface CodeBlockProps {
  code: Code
}

export const CodeBlock = ({ code }: CodeBlockProps) => {
  if (!code?.code) {
    return <p>Hmmm, ingen kode her!</p>
  }
  return <SyntaxHighlighter language={code.language ?? 'text'}>{code.code}</SyntaxHighlighter>
}
