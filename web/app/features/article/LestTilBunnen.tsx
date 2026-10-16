import { useEffect, useRef } from 'react'
import { parseIsoDate } from 'utils/calendar'
import { visBeskjed } from '~/features/jule-egg/Beskjeder'
import { finnEgg } from '~/features/jule-egg/lager'
import { lestTilBunnen } from '~/features/jule-egg/leste'
import { fireSnowCannon } from '~/features/jule-egg/snokanon'

const tekster = {
  norwegian: {
    rudolf: 'Du leste hele! Det er det bare 12 % som gjør.',
    kudos: (luke: number) => `Du har lest alt fra luke ${luke}! Kudos! 🏆`,
  },
  english: {
    rudolf: 'You read the whole thing! Only 12 % of readers do that.',
    kudos: (luke: number) => `You've read everything from door ${luke}! Kudos! 🏆`,
  },
}

type LestTilBunnenProps = {
  postId: string
  type: string | null
  language?: string | null
  /** Datoen posten hører til, på formatet YYYY-MM-DD */
  availableFrom: string
  /** Alle postene samme dag, inkludert denne */
  sameDayPostIds: string[]
}

/**
 * Merker at man har kommet til bunnen av en post. Har man lest alt fra den dagen, blir det
 * kudos med snøkanon. Ellers titter Rudolf opp og gratulerer, i artikler. Bare én gang per post.
 */
export const LestTilBunnen = ({ postId, type, language, availableFrom, sameDayPostIds }: LestTilBunnenProps) => {
  const markor = useRef<HTMLDivElement>(null)
  const tekst = tekster[language === 'en-US' ? 'english' : 'norwegian']

  useEffect(() => {
    const element = markor.current
    if (!element) {
      return
    }
    // Sjekker ved scroll i stedet for med IntersectionObserver, siden End-tasten og raske scroll kan hoppe forbi bunnen
    const onScroll = () => {
      // Krever at man har scrollet, så korte poster som får plass på skjermen ikke teller
      if (element.getBoundingClientRect().top >= window.innerHeight || window.scrollY <= window.innerHeight / 2) {
        return
      }
      window.removeEventListener('scroll', onScroll)

      if (lestTilBunnen(availableFrom, postId, sameDayPostIds)) {
        fireSnowCannon()
        visBeskjed({ figur: 'rudolf', tekst: tekst.kudos(parseIsoDate(availableFrom).day) })
        finnEgg('dagens-leser')
      } else if (type === 'article') {
        visBeskjed({ figur: 'rudolf', tekst: tekst.rudolf })
      }
      if (type === 'article') {
        finnEgg('rudolf')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [postId, type, availableFrom, sameDayPostIds, tekst])

  return <div ref={markor} aria-hidden="true" />
}
