import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { Code } from '../../utils/sanity/types/sanity.types'

import useClientSideOnly from '~/hooks/useClientSideOnly'

interface CodeBlockProps {
  code: Code
}
export const CodeBlock = ({ code }: CodeBlockProps) => {
  const isClientSide = useClientSideOnly()

  if (!code.code) {
    return null
  }

  return (
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-hidden rounded-md">
      <div className="overflow-x-auto bg-gray-50">
        {isClientSide ? (
          <SyntaxHighlighter customStyle={{ backgroundColor: 'transparent' }} language={code.language ?? 'text'}>
            {code.code}
          </SyntaxHighlighter>
        ) : (
          <code>{code.code}</code>
        )}
      </div>
    </div>
  )
}
