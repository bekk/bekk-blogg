import { useEffect } from 'react'
import { visBeskjed } from '~/features/jule-egg/Beskjeder'
import { finnEgg } from '~/features/jule-egg/lager'
import { erNatt } from '~/features/jule-egg/sensorer'

/** Hvor lenge man må ha lest før nattnissen sier fra */
const NATTNISSE_ETTER_MS = 8000

const tekster = {
  norwegian: {
    natt: 'Burde ikke du ligge og sove? 😴',
    kodekopi: 'Husk å si hvor du fant den 😉',
  },
  english: {
    natt: "Shouldn't you be asleep by now? 😴",
    kodekopi: 'Remember to say where you found it 😉',
  },
}

/**
 * Jule-egg i artikler: en søvnig nisse dukker opp hvis man leser midt på natta,
 * og en nisse minner om kildehenvisning når man kopierer kode.
 */
export const ArtikkelEgg = ({ language }: { language?: string | null }) => {
  const tekst = tekster[language === 'en-US' ? 'english' : 'norwegian']

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (erNatt(new Date())) {
        visBeskjed({ figur: 'sovende-nisse', tekst: tekst.natt })
        finnEgg('nattnisse')
      }
    }, NATTNISSE_ETTER_MS)
    return () => clearTimeout(timeout)
  }, [tekst])

  useEffect(() => {
    let harSagtFra = false
    const onKopi = () => {
      const node = document.getSelection()?.anchorNode
      const element = node instanceof Element ? node : node?.parentElement
      if (harSagtFra || !element?.closest('article pre')) {
        return
      }
      harSagtFra = true
      visBeskjed({ figur: 'nisse', tekst: tekst.kodekopi })
      finnEgg('kodekopi')
    }
    document.addEventListener('copy', onKopi)
    return () => document.removeEventListener('copy', onKopi)
  }, [tekst])

  return null
}
