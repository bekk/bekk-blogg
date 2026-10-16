import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from 'utils/analytics'
import { useKonamiCode } from '~/hooks/useKonamiCode'
import { useTastesekvens } from '~/hooks/useTastesekvens'

import { Beskjeder, visBeskjed } from './Beskjeder'
import { antallFunnet, finnEggInfo, VANLIGE_EGG } from './egg'
import { finnEgg, FUNNET_HENDELSE, lesFunnet } from './lager'
import { erLeet } from './sensorer'

import './jule-egg.css'

// Lastes først når noen taster konamikoden
const Nisseregn = lazy(() => import('~/features/teaser/nisseregn/Nisseregn'))

/** Viser et lite varsel øverst når man finner et nytt egg */
const FunnetVarsel = () => {
  const [varsel, setVarsel] = useState<{ id: string; tekst: string } | null>(null)

  useEffect(() => {
    const onFunnet = (event: Event) => {
      const id = (event as CustomEvent<string>).detail
      const egg = finnEggInfo(id)
      if (!egg) {
        return
      }
      trackEvent('easter_egg_found', { egg: id })
      setVarsel({
        id,
        tekst: egg.bonus
          ? `${egg.emoji} Bonusegg funnet: ${egg.tittel}!`
          : `🥚 Jule-egg funnet: ${egg.tittel} (${antallFunnet(lesFunnet())} av ${VANLIGE_EGG.length})`,
      })
    }
    window.addEventListener(FUNNET_HENDELSE, onFunnet)
    return () => window.removeEventListener(FUNNET_HENDELSE, onFunnet)
  }, [])

  useEffect(() => {
    if (!varsel) {
      return
    }
    const timeout = setTimeout(() => setVarsel(null), 4000)
    return () => clearTimeout(timeout)
  }, [varsel])

  return (
    <AnimatePresence>
      {varsel && (
        <motion.a
          key={varsel.id}
          href="/jule-egg"
          role="status"
          className="fixed left-1/2 top-4 z-[110] -translate-x-1/2 rounded-full bg-dark-green px-5 py-2 text-center text-sm text-white shadow-lg sm:text-base"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
        >
          {varsel.tekst}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/** Når man går fra fanen, savner vi deg. Egget telles når man kommer tilbake, så man faktisk ser varselet. */
const useFanetittel = () => {
  useEffect(() => {
    let lagretTittel: string | null = null
    const onSynlighet = () => {
      if (document.visibilityState === 'hidden') {
        lagretTittel = document.title
        document.title = new Date().getHours() >= 18 ? 'Nissen savner deg 🎅' : 'Kom tilbake! 🥺'
      } else if (lagretTittel !== null) {
        document.title = lagretTittel
        lagretTittel = null
        finnEgg('fanetittel')
      }
    }
    document.addEventListener('visibilitychange', onSynlighet)
    return () => document.removeEventListener('visibilitychange', onSynlighet)
  }, [])
}

/** Klokka 13.37 blinker det et lite «1337» øverst på siden */
const Leet = () => {
  const [leet, setLeet] = useState(false)

  useEffect(() => {
    const sjekk = () => setLeet(erLeet(new Date()))
    sjekk()
    const intervall = setInterval(sjekk, 10_000)
    return () => clearInterval(intervall)
  }, [])

  useEffect(() => {
    if (leet) {
      finnEgg('leet')
    }
  }, [leet])

  return leet ? (
    <div
      aria-hidden="true"
      className="jule-egg-leet pointer-events-none fixed left-1/2 top-1 z-[105] -translate-x-1/2 font-mono text-sm font-bold text-christmas-tree-green"
    >
      1337 h4xx0r-jul 🎄
    </div>
  ) : null
}

/** Klikker man fem ganger på Bekk-logoen, blir musepekeren en stjerne som drar etter seg glitter */
const useGlitterstjerne = () => {
  const klikk = useRef<number[]>([])
  const [aktiv, setAktiv] = useState(false)

  useEffect(() => {
    const onKlikk = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-jule-egg="logo"]')) {
        return
      }
      const naa = Date.now()
      klikk.current = [...klikk.current.filter((tid) => naa - tid < 3000), naa]
      if (klikk.current.length >= 5) {
        setAktiv(true)
        finnEgg('glitter')
      }
    }
    document.addEventListener('click', onKlikk)
    return () => document.removeEventListener('click', onKlikk)
  }, [])

  useEffect(() => {
    if (!aktiv) {
      return
    }
    document.documentElement.classList.add('jule-egg-stjernepeker')
    let forrige = 0
    const onBevegelse = (event: PointerEvent) => {
      const naa = performance.now()
      if (naa - forrige < 40) {
        return
      }
      forrige = naa
      const glitter = document.createElement('span')
      glitter.textContent = Math.random() < 0.5 ? '✨' : '⭐'
      glitter.className = 'jule-egg-glitter'
      glitter.setAttribute('aria-hidden', 'true')
      glitter.style.left = `${event.clientX}px`
      glitter.style.top = `${event.clientY}px`
      glitter.addEventListener('animationend', () => glitter.remove())
      document.body.appendChild(glitter)
    }
    window.addEventListener('pointermove', onBevegelse)
    return () => {
      window.removeEventListener('pointermove', onBevegelse)
      document.documentElement.classList.remove('jule-egg-stjernepeker')
    }
  }, [aktiv])
}

/**
 * Alle jule-eggene som ikke hører til en bestemt side, og varselet når man finner et.
 * Monteres én gang i appen, men ikke i Studioet. Se /jule-egg for hele lista.
 */
export const JuleEgg = () => {
  const [nisseregn, setNisseregn] = useState(false)
  useKonamiCode(() => {
    if (!nisseregn) {
      setNisseregn(true)
      finnEgg('nisseregn')
    }
  })
  const lukkNisseregn = useCallback(() => setNisseregn(false), [])

  // Hemmeligheten fra hilsenen til språkmodellene i llms.txt og markdown-versjonene
  useTastesekvens(['h', 'o', 'h', 'o', 'h', 'o'], () => {
    visBeskjed({ figur: 'nisse', tekst: 'Ho ho ho! Hils språkmodellene fra meg 🤖' })
    finnEgg('sprakmodell')
  })

  useFanetittel()
  useGlitterstjerne()

  return (
    <>
      <FunnetVarsel />
      <Beskjeder />
      <Leet />
      {nisseregn && (
        <Suspense fallback={null}>
          <Nisseregn onLukk={lukkNisseregn} />
        </Suspense>
      )}
    </>
  )
}
