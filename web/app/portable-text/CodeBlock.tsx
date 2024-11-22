import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { Code } from '../../utils/sanity/types/sanity.types'

interface CodeBlockProps {
  code: Code
}
export const CodeBlock = ({ code }: CodeBlockProps) => {
  if (!code?.code) {
    return null
  }
  return (
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-x-auto">
      <SyntaxHighlighter customStyle={{ backgroundColor: '#E9E9E9' }} language={code.language ?? 'text'}>
        {code.code}
      </SyntaxHighlighter>
    </div>
  )
}
