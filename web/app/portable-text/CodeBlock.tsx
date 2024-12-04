import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { Code } from '../../utils/sanity/types/sanity.types'

interface CodeBlockProps {
  code: Code
}
export const CodeBlock = ({ code }: CodeBlockProps) => {
  // Denne 'unødvendige' state-variabelen er en workaround for å unngå dette: https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/538
  const [codeState, setCodeState] = useState<string | undefined>()

  useEffect(() => {
    if (code.code) {
      setCodeState(code.code)
    }
  }, [code.code])

  if (!codeState) {
    return null
  }

  return (
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-hidden rounded-md">
      <div className="overflow-x-auto bg-gray-50">
        <SyntaxHighlighter customStyle={{ backgroundColor: 'transparent' }} language={code.language ?? 'text'}>
          {codeState}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
