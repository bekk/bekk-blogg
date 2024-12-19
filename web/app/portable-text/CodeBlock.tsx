import { Refractor, registerLanguage } from 'react-refractor'
import bash from 'refractor/lang/bash.js'
import clojure from 'refractor/lang/clojure.js'
import csharp from 'refractor/lang/csharp.js'
import css from 'refractor/lang/css.js'
import csv from 'refractor/lang/csv.js'
import diff from 'refractor/lang/diff.js'
import docker from 'refractor/lang/docker.js'
import elixir from 'refractor/lang/elixir.js'
import elm from 'refractor/lang/elm.js'
import fsharp from 'refractor/lang/fsharp.js'
import glsl from 'refractor/lang/glsl.js'
import gradle from 'refractor/lang/gradle.js'
import graphql from 'refractor/lang/graphql.js'
import groovy from 'refractor/lang/groovy.js'
import haskell from 'refractor/lang/haskell.js'
import hcl from 'refractor/lang/hcl.js'
import idris from 'refractor/lang/idris.js'
import java from 'refractor/lang/java.js'
import json from 'refractor/lang/json.js'
import jsx from 'refractor/lang/jsx.js'
import kotlin from 'refractor/lang/kotlin.js'
import less from 'refractor/lang/less.js'
import lisp from 'refractor/lang/lisp.js'
import markdown from 'refractor/lang/markdown.js'
import html from 'refractor/lang/markup.js'
import nix from 'refractor/lang/nix.js'
import powershell from 'refractor/lang/powershell.js'
import python from 'refractor/lang/python.js'
import rust from 'refractor/lang/rust.js'
import scala from 'refractor/lang/scala.js'
import scss from 'refractor/lang/scss.js'
import sql from 'refractor/lang/sql.js'
import stylus from 'refractor/lang/stylus.js'
import swift from 'refractor/lang/swift.js'
import tsx from 'refractor/lang/tsx.js'
import yaml from 'refractor/lang/yaml.js'

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
