import { Refractor, registerLanguage } from 'react-refractor'
import bash from 'refractor/bash'
import clojure from 'refractor/clojure'
import csharp from 'refractor/csharp'
import css from 'refractor/css'
import csv from 'refractor/csv'
import diff from 'refractor/diff'
import docker from 'refractor/docker'
import elixir from 'refractor/elixir'
import elm from 'refractor/elm'
import fsharp from 'refractor/fsharp'
import glsl from 'refractor/glsl'
import gradle from 'refractor/gradle'
import graphql from 'refractor/graphql'
import groovy from 'refractor/groovy'
import haskell from 'refractor/haskell'
import hcl from 'refractor/hcl'
import idris from 'refractor/idris'
import java from 'refractor/java'
import json from 'refractor/json'
import jsx from 'refractor/jsx'
import kotlin from 'refractor/kotlin'
import less from 'refractor/less'
import lisp from 'refractor/lisp'
import markdown from 'refractor/markdown'
import html from 'refractor/markup'
import nix from 'refractor/nix'
import powershell from 'refractor/powershell'
import python from 'refractor/python'
import rust from 'refractor/rust'
import scala from 'refractor/scala'
import scss from 'refractor/scss'
import sql from 'refractor/sql'
import stylus from 'refractor/stylus'
import swift from 'refractor/swift'
import tsx from 'refractor/tsx'
import yaml from 'refractor/yaml'

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
registerLanguage(sql)
registerLanguage(yaml)
registerLanguage(markdown)
registerLanguage(powershell)
registerLanguage(graphql)
registerLanguage(stylus)
registerLanguage(groovy)
registerLanguage(gradle)
registerLanguage(csv)
registerLanguage(elixir)
registerLanguage(idris)
registerLanguage(glsl)
registerLanguage(hcl)
registerLanguage(docker)
interface CodeBlockProps {
  code: CodeType
}
export const CodeBlock = ({ code }: CodeBlockProps) => {
  if (!code?.code) {
    return null
  }
  let language = nonSupportedLanguages.includes(code.language ?? '') ? 'text' : (code.language ?? 'text')
  language = language.toLowerCase()
  return (
    <div className="codeBlockColorOverride text-sm max-w-[800px] overflow-hidden rounded-md">
      <div className="overflow-x-auto bg-gray-50 p-4">
        <Refractor language={language} value={code.code} />
      </div>
    </div>
  )
}

/** These are languages that are not supported by refractor,
 * but that are in the Sanity database somehow.
 * In a perfect world, we should remove them from the database.
 **/
const nonSupportedLanguages = ['jsonnet', 'F#', 'example', 'math', 'jsonc', 'svelte']
