import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { trackEvent } from 'utils/analytics'
import { Button } from '~/components/ui/button'

import { harNaddBunnen, steg, type Flate, type Nisse } from './fysikk'
import { NisseFigur } from './NisseFigur'
import './nisseregn.css'

/** Hvor mange nisser man kan slippe unna før spillet er over */
const MAKS_BOM = 10
const NISSE_BREDDE = 48
const NISSE_HOYDE = 56
const REKORD_NOKKEL = 'nisseregn-rekord'

/**
 * Elementer med `data-nisse-flate` blir flater nissene kan løpe på. For elementer med `data-nisse-flater`
 * (som SVG-ene med gaver) blir hver store `rect` inni en egen flate.
 */
const finnFlateelementer = () => {
  const enkelt = [...document.querySelectorAll<Element>('[data-nisse-flate]')]
  const fraSvg = [...document.querySelectorAll<Element>('[data-nisse-flater] rect')].filter((element) => {
    const { width, height } = element.getBoundingClientRect()
    return width >= 40 && height >= 30
  })
  return [...enkelt, ...fraSvg]
}

const tilFlate = (element: Element): Flate => {
  const { left, right, top } = element.getBoundingClientRect()
  return { venstre: left, hoyre: right, topp: top }
}

const plasser = (element: HTMLElement, nisse: Nisse) => {
  element.style.transform = `translate(${nisse.x - NISSE_BREDDE / 2}px, ${nisse.y - NISSE_HOYDE}px)`
  element.dataset.tilstand = nisse.flate === null ? 'faller' : 'loper'
  element.dataset.retning = nisse.vx < 0 ? 'venstre' : 'hoyre'
}

const hentRekord = () => Number(localStorage.getItem(REKORD_NOKKEL)) || 0

type Poff = { id: number; x: number; y: number }

type NisseregnProps = {
  onLukk: () => void
}

/** Easter egg på venteskjermen: nisser regner ned og løper rundt, og man må fange dem før de når bunnen */
export default function Nisseregn({ onLukk }: NisseregnProps) {
  const [runde, setRunde] = useState(0)
  const [ider, setIder] = useState<number[]>([])
  const [poeng, setPoeng] = useState(0)
  const [bom, setBom] = useState(0)
  const [poffer, setPoffer] = useState<Poff[]>([])
  const [rekord, setRekord] = useState(hentRekord)
  const nisser = useRef(new Map<number, Nisse>())
  const elementer = useRef(new Map<number, HTMLElement>())
  const ferdig = bom >= MAKS_BOM

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onLukk()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onLukk])

  useEffect(() => {
    const aktive = nisser.current
    aktive.clear()
    setIder([])

    let flateelementer = finnFlateelementer()
    const onResize = () => {
      flateelementer = finnFlateelementer()
    }
    window.addEventListener('resize', onResize)

    let tid = 0
    let tilNesteNisse = 0.3
    let antallBom = 0
    let nesteId = 1
    let forrige = performance.now()
    let ramme = 0

    const tikk = (naa: number) => {
      // Begrenset, så nissene ikke teleporterer når fanen har vært i bakgrunnen
      const dt = Math.min((naa - forrige) / 1000, 0.05)
      forrige = naa
      tid += dt

      const omgivelser = {
        flater: flateelementer.map(tilFlate),
        bredde: window.innerWidth,
        fallfart: Math.min(200 + tid * 4, 520),
      }

      // Det kommer flere og raskere nisser jo lenger spillet varer
      tilNesteNisse -= dt
      if (tilNesteNisse <= 0) {
        tilNesteNisse = Math.max(0.35, 1.6 - tid * 0.025) * (0.6 + Math.random() * 0.8)
        const fart = Math.min(70 + tid * 2.5, 240) * (0.7 + Math.random() * 0.6)
        const nisse: Nisse = {
          id: nesteId++,
          x: NISSE_BREDDE + Math.random() * (omgivelser.bredde - NISSE_BREDDE * 2),
          y: 0,
          vx: Math.random() < 0.5 ? -fart : fart,
          vy: 0,
          flate: null,
        }
        aktive.set(nisse.id, nisse)
        setIder((ider) => [...ider, nisse.id])
      }

      const sluppetUnna: number[] = []
      for (const nisse of aktive.values()) {
        const neste = steg(nisse, dt, omgivelser)
        if (harNaddBunnen(neste, window.innerHeight)) {
          aktive.delete(nisse.id)
          sluppetUnna.push(nisse.id)
          continue
        }
        aktive.set(nisse.id, neste)
        const element = elementer.current.get(nisse.id)
        if (element) {
          plasser(element, neste)
        }
      }

      if (sluppetUnna.length > 0) {
        antallBom = Math.min(antallBom + sluppetUnna.length, MAKS_BOM)
        setBom(antallBom)
        setIder((ider) => ider.filter((id) => !sluppetUnna.includes(id)))
      }

      if (antallBom >= MAKS_BOM) {
        aktive.clear()
        setIder([])
        return
      }
      ramme = requestAnimationFrame(tikk)
    }
    ramme = requestAnimationFrame(tikk)

    return () => {
      cancelAnimationFrame(ramme)
      window.removeEventListener('resize', onResize)
    }
  }, [runde])

  useEffect(() => {
    if (!ferdig) {
      return
    }
    trackEvent('easter_egg_nisseregn_lost', { poeng })
    if (poeng > hentRekord()) {
      localStorage.setItem(REKORD_NOKKEL, String(poeng))
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- skal bare kjøre når spillet slutter
  }, [ferdig])

  const fang = (id: number, event: PointerEvent) => {
    // Hindrer at klikket også treffer lenker under nissen
    event.preventDefault()
    event.stopPropagation()
    const nisse = nisser.current.get(id)
    if (!nisse || ferdig) {
      return
    }
    nisser.current.delete(id)
    setIder((ider) => ider.filter((annen) => annen !== id))
    setPoeng((poeng) => poeng + 1)
    setPoffer((poffer) => [...poffer, { id, x: nisse.x, y: nisse.y - NISSE_HOYDE }])
  }

  const spillIgjen = () => {
    setRekord(hentRekord())
    setPoeng(0)
    setBom(0)
    setRunde((runde) => runde + 1)
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden touch-none select-none">
      {ider.map((id) => (
        <button
          key={id}
          type="button"
          aria-label="Fang nissen"
          className="nisse absolute left-0 top-0 cursor-pointer will-change-transform"
          style={{ width: NISSE_BREDDE, height: NISSE_HOYDE }}
          onPointerDown={(event) => fang(id, event)}
          ref={(element) => {
            const nisse = nisser.current.get(id)
            if (element && nisse) {
              elementer.current.set(id, element)
              plasser(element, nisse)
            } else if (!element) {
              elementer.current.delete(id)
            }
          }}
        >
          <span className="nisse-kropp block size-full">
            <NisseFigur />
          </span>
        </button>
      ))}

      {poffer.map((poff) => (
        <span
          key={poff.id}
          className="nisse-poff pointer-events-none absolute text-2xl font-bold text-red-berry"
          style={{ left: poff.x, top: poff.y }}
          onAnimationEnd={() => setPoffer((poffer) => poffer.filter((annen) => annen.id !== poff.id))}
        >
          +1
        </span>
      ))}

      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-postcard-beige/95 px-5 py-2 shadow-lg">
          <span className="font-bold">🎅 Nisseregn</span>
          <span>Fanget: {poeng}</span>
          <span aria-label={`${bom} av ${MAKS_BOM} nisser sluppet unna`}>
            Bom: {bom}/{MAKS_BOM}
          </span>
          <Button variant="secondary" size="sm" onClick={onLukk}>
            Avslutt
          </Button>
        </div>
      </div>

      {poeng === 0 && bom === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-24 text-center text-xl text-red-berry">
          Fang nissene før de når bunnen!
        </p>
      )}

      {ferdig && (
        <div className="absolute inset-0 flex items-center justify-center bg-bekk-night/40 p-4">
          <div
            role="dialog"
            aria-labelledby="nisseregn-tittel"
            className="flex max-w-sm flex-col items-center gap-4 rounded-lg bg-postcard-beige p-8 text-center shadow-xl"
          >
            <h2 id="nisseregn-tittel" className="text-3xl">
              Nissene slapp unna!
            </h2>
            <p className="text-lg">
              Du fanget {poeng} {poeng === 1 ? 'nisse' : 'nisser'}.
              <br />
              {poeng > rekord ? 'Det er ny rekord! 🎉' : `Rekorden din er ${rekord}.`}
            </p>
            <div className="flex gap-2">
              <Button onClick={spillIgjen} autoFocus>
                Spill igjen
              </Button>
              <Button variant="secondary" onClick={onLukk}>
                Lukk
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
