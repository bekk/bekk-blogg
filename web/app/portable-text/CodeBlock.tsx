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
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-hidden rounded-md">
      <div className="overflow-x-auto bg-gray-50">
        <SyntaxHighlighter customStyle={{ backgroundColor: 'transparent' }} language={code.language ?? 'text'}>
          {code.code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
