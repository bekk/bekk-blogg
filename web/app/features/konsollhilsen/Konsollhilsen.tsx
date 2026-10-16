import { useEffect } from 'react'

const NISSE = String.raw`
        *
       /.\
      /..'\
      /'.'\        Hei, du som kikker under panseret! 🎅
     /.''.'\
     /.'.'.\       Liker du å grave i andres kode?
    /'.''.'.\      Da passer du kanskje inn hos oss.
    ^^^[_]^^^
`

// Settes på modulnivå, så hilsenen ikke skrives to ganger når React kjører effekter dobbelt i dev
let harHilst = false

/** Easter egg: en hilsen og en jobbannonse til utviklerne som åpner konsollen */
export const Konsollhilsen = () => {
  useEffect(() => {
    if (harHilst) {
      return
    }
    harHilst = true
    console.log(`%c${NISSE}`, 'color: #2f7346; font-family: monospace; font-weight: bold')
    console.log(
      '%cBekk ansetter! Se ledige stillinger på https://www.bekk.no/jobb',
      'color: #a7060e; font-size: 14px; font-weight: bold'
    )
  }, [])

  return null
}
