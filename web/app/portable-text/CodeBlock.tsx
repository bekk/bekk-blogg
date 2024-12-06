import { Refractor, registerLanguage } from 'react-refractor'
import bash from 'refractor/lang/bash.js'
import clojure from 'refractor/lang/clojure.js'
import csharp from 'refractor/lang/csharp.js'
import css from 'refractor/lang/css.js'
import diff from 'refractor/lang/diff.js'
import elm from 'refractor/lang/elm.js'
import fsharp from 'refractor/lang/fsharp.js'
import haskell from 'refractor/lang/haskell.js'
import java from 'refractor/lang/java.js'
import json from 'refractor/lang/json.js'
import jsx from 'refractor/lang/jsx.js'
import kotlin from 'refractor/lang/kotlin.js'
import less from 'refractor/lang/less.js'
import lisp from 'refractor/lang/lisp.js'
import html from 'refractor/lang/markup.js'
import nix from 'refractor/lang/nix.js'
import python from 'refractor/lang/python.js'
import rust from 'refractor/lang/rust.js'
import scala from 'refractor/lang/scala.js'
import scss from 'refractor/lang/scss.js'
import swift from 'refractor/lang/swift.js'
import tsx from 'refractor/lang/tsx.js'

import { Code as CodeType } from '../../utils/sanity/types/sanity.types'

registerLanguage(bash)
registerLanguage(clojure)
registerLanguage(lisp)
registerLanguage(css)
registerLanguage(diff)
registerLanguage(elm)
registerLanguage(csharp)
registerLanguage(fsharp)
registerLanguage(haskell)
registerLanguage(html)
registerLanguage(less)
registerLanguage(java)
registerLanguage(jsx)
registerLanguage(json)
registerLanguage(kotlin)
registerLanguage(nix)
registerLanguage(python)
registerLanguage(rust)
registerLanguage(scala)
registerLanguage(scss)
registerLanguage(swift)
registerLanguage(tsx)

interface CodeBlockProps {
  code: CodeType
}
export const CodeBlock = ({ code }: CodeBlockProps) => {
  if (!code?.code) {
    return null
  }
  return (
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-hidden rounded-md">
      <div className="overflow-x-auto bg-gray-50 p-4">
        <Refractor language={code.language ?? 'text'} value={code.code} />
      </div>
    </div>
  )
}
