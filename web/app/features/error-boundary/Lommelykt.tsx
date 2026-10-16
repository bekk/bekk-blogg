import { useEffect, useRef } from 'react'
import { NisseFigur } from '~/components/NisseFigur'

const NISSE_BREDDE = 72
const NISSE_HOYDE = 84
/** Hvor langt unna lyset nissen helst vil stå */
const AVSTAND = 140
/** Hvor fort nissen går, i px per sekund */
const GANGFART = 260

type Punkt = { x: number; y: number }

const midtenAv = (element: Element): Punkt => {
  const { left, top, width, height } = element.getBoundingClientRect()
  return { x: left + width / 2, y: top + height / 2 }
}

/**
 * Easter egg på 404-sidene: det er mørkt, og en nisse leter etter siden med lommelykt.
 * Lyset følger musepekeren, fingeren eller fokus, og står på overskriften til å begynne med.
 */
export const Lommelykt = () => {
  const morke = useRef<HTMLDivElement>(null)
  const straale = useRef<SVGPolygonElement>(null)
  const gradient = useRef<SVGLinearGradientElement>(null)
  const lykt = useRef<SVGGElement>(null)
  const nisse = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overskrift = document.querySelector('h1')
    let lys: Punkt = overskrift ? midtenAv(overskrift) : { x: window.innerWidth / 2, y: window.innerHeight / 3 }
    let nisseX = lys.x - AVSTAND
    let forrige = performance.now()
    let ramme = 0

    const onPointer = (event: PointerEvent) => {
      lys = { x: event.clientX, y: event.clientY }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        lys = midtenAv(event.target)
      }
    }
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('focusin', onFocus)

    const tikk = (naa: number) => {
      const dt = Math.min((naa - forrige) / 1000, 0.05)
      forrige = naa
      const bredde = window.innerWidth
      const hoyde = window.innerHeight
      const radius = Math.min(170, bredde / 4)

      // Nissen går mot et sted litt til siden for lyset, så den ikke står i veien
      const side = lys.x > bredde / 2 ? -1 : 1
      const maal = Math.min(Math.max(lys.x + side * AVSTAND, NISSE_BREDDE / 2), bredde - NISSE_BREDDE / 2)
      const avstand = maal - nisseX
      const skritt = Math.sign(avstand) * Math.min(Math.abs(avstand), GANGFART * dt)
      nisseX += skritt
      const retning = lys.x < nisseX ? 'venstre' : 'hoyre'

      if (nisse.current) {
        nisse.current.style.transform = `translateX(${nisseX - NISSE_BREDDE / 2}px)`
        nisse.current.dataset.tilstand = Math.abs(avstand) > 2 ? 'loper' : 'star'
        nisse.current.dataset.retning = retning
      }

      // Hånda til nissen, der lommelykta er
      const hand = { x: nisseX + (retning === 'hoyre' ? 1 : -1) * NISSE_BREDDE * 0.35, y: hoyde - NISSE_HOYDE * 0.38 }
      const vinkel = Math.atan2(lys.y - hand.y, lys.x - hand.x)
      const normal = { x: -Math.sin(vinkel), y: Math.cos(vinkel) }

      morke.current?.style.setProperty('--lys-x', `${lys.x}px`)
      morke.current?.style.setProperty('--lys-y', `${lys.y}px`)
      morke.current?.style.setProperty('--lys-radius', `${radius}px`)
      straale.current?.setAttribute(
        'points',
        [
          [hand.x + normal.x * 5, hand.y + normal.y * 5],
          [lys.x + normal.x * radius, lys.y + normal.y * radius],
          [lys.x - normal.x * radius, lys.y - normal.y * radius],
          [hand.x - normal.x * 5, hand.y - normal.y * 5],
        ]
          .map((punkt) => punkt.join(','))
          .join(' ')
      )
      // Strålen blir svakere jo lenger unna lommelykta den kommer
      gradient.current?.setAttribute('x1', String(hand.x))
      gradient.current?.setAttribute('y1', String(hand.y))
      gradient.current?.setAttribute('x2', String(lys.x))
      gradient.current?.setAttribute('y2', String(lys.y))
      lykt.current?.setAttribute('transform', `translate(${hand.x} ${hand.y}) rotate(${(vinkel * 180) / Math.PI})`)

      ramme = requestAnimationFrame(tikk)
    }
    ramme = requestAnimationFrame(tikk)

    return () => {
      cancelAnimationFrame(ramme)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('focusin', onFocus)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={morke}
        className="absolute inset-0 bg-[#080a19]/95"
        style={{
          maskImage:
            'radial-gradient(circle var(--lys-radius, 170px) at var(--lys-x, 50%) var(--lys-y, 30%), transparent 65%, black 100%)',
        }}
      />
      <svg className="absolute inset-0 size-full">
        <defs>
          <linearGradient ref={gradient} id="lommelykt-straale" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffebbf" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffebbf" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon ref={straale} fill="url(#lommelykt-straale)" />
        <g ref={lykt}>
          <rect x="-4" y="-5" width="18" height="10" rx="2" fill="#1f1f1f" />
          <rect x="12" y="-6" width="4" height="12" rx="1" fill="#ffebbf" />
        </g>
      </svg>
      <div ref={nisse} className="nisse absolute bottom-0 left-0" style={{ width: NISSE_BREDDE, height: NISSE_HOYDE }}>
        <div className="nisse-kropp size-full">
          <NisseFigur />
        </div>
      </div>
    </div>
  )
}
