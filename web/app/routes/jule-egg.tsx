import { useEffect, useState, type ReactNode } from 'react'
import { Link, MetaFunction, useLoaderData } from 'react-router'
import { getLatestCalendarYear, getOsloDate } from 'utils/calendar'

import { ALLE_EGG, antallFunnet, VANLIGE_EGG, type Egg, type EggId } from '~/features/jule-egg/egg'
import { FUNNET_HENDELSE, lesFunnet } from '~/features/jule-egg/lager'
import { useHydrated } from '~/hooks/useHydrated'

// Oversikt over alle jule-eggene, og hvilke man har funnet. Den lenkes ikke til fra noe sted, og skal ikke indekseres.

export const loader = () => ({ year: getLatestCalendarYear(getOsloDate()) })

export const meta: MetaFunction = () => [
  { title: 'Jule-egg | Bekk Christmas' },
  { name: 'description', content: 'Alle de skjulte påskeeggene – eller jule-eggene – på Bekk Christmas' },
  { name: 'robots', content: 'noindex, nofollow' },
]

const Tast = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded border border-bekk-night bg-white px-1.5 py-0.5 font-mono text-sm">{children}</kbd>
)

const lenke = 'underline hover:text-reindeer-brown'

type IOSDeviceMotionEvent = typeof DeviceMotionEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

/** På iOS må man gi lov før nettsiden får vite at telefonen ristes, og det må skje fra et trykk */
const RisteTillatelse = () => {
  const isHydrated = useHydrated()
  const [status, setStatus] = useState<'trengs' | 'gitt' | 'nektet'>('trengs')
  const trengerTillatelse =
    isHydrated &&
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as IOSDeviceMotionEvent).requestPermission === 'function'

  if (!trengerTillatelse) {
    return null
  }
  if (status !== 'trengs') {
    return <p className="mt-2 text-sm">{status === 'gitt' ? 'Takk! Nå er det bare å riste.' : 'Den gang ei.'}</p>
  }
  return (
    <button
      type="button"
      className="mt-3 rounded-md bg-dark-green px-3 py-2 text-sm text-white"
      onClick={async () => {
        const svar = await (DeviceMotionEvent as IOSDeviceMotionEvent).requestPermission?.()
        setStatus(svar === 'granted' ? 'gitt' : 'nektet')
      }}
    >
      Gi nettsiden lov til å kjenne at du rister
    </button>
  )
}

const forklaringer = (year: number): Record<EggId, { hvor: ReactNode; hvordan: ReactNode }> => ({
  nisseregn: {
    hvor: 'Hvor som helst på siden',
    hvordan: (
      <>
        Tast konamikoden: <Tast>↑</Tast> <Tast>↑</Tast> <Tast>↓</Tast> <Tast>↓</Tast> <Tast>←</Tast> <Tast>→</Tast>{' '}
        <Tast>←</Tast> <Tast>→</Tast> <Tast>B</Tast> <Tast>A</Tast>. På mobil sveiper du i de samme retningene og
        trykker to ganger til slutt. Det regner nisser som løper rundt på flatene på siden, og du må trykke på dem før
        de når bunnen. Slipper 10 unna, har du tapt.
      </>
    ),
  },
  nissefanger: {
    hvor: 'Nisseregnet',
    hvordan: 'Fang 25 nisser i én runde.',
  },
  sno: {
    hvor: 'Hvor som helst på siden, men ikke i et tekstfelt',
    hvordan: (
      <>
        Skriv <Tast>s</Tast> <Tast>n</Tast> <Tast>ø</Tast>, så kommer det en snøbyge. På mobil søker du etter «snø».
      </>
    ),
  },
  'sno-opp': {
    hvor: 'Hvor som helst på siden, men ikke i et tekstfelt',
    hvordan: (
      <>
        Skriv <Tast>ø</Tast> <Tast>n</Tast> <Tast>s</Tast>, så snør det oppover. På mobil søker du etter «øns».
      </>
    ),
  },
  lommelykt: {
    hvor: (
      <>
        Alle sider som{' '}
        <Link to="/finnes-ikke" className={lenke}>
          ikke finnes
        </Link>
      </>
    ),
    hvordan: 'Det er mørkt, og en nisse leter etter siden med lommelykt. Lyset følger musepekeren eller fingeren.',
  },
  kikkenisse: {
    hvor: 'Lukkede luker i kalenderen, fra 1. til 23. desember',
    hvordan: 'Klikk tre ganger på en luke som ikke er åpnet ennå, så kikker en nisse opp bak konvolutten.',
  },
  nisserumpa: {
    hvor: 'Lukkede luker i kalenderen, fra 1. til 23. desember',
    hvordan:
      'Fortsett å klikke. Nissen rister på hodet, skriver deg på slemmelista og blir sur. Ved klikk nummer 50 får du se rumpa hans.',
  },
  rudolf: {
    hvor: 'Alle artikler',
    hvordan: 'Les (eller scroll) helt til bunnen av en artikkel, så titter Rudolf opp nede i hjørnet og gratulerer.',
  },
  konsoll: {
    hvor: 'Alle sider',
    hvordan: (
      <>
        Åpne utviklerverktøyene i nettleseren, les hilsenen i konsollen og skriv <code>jul()</code>. Uten konsoll kan du
        søke etter <code>jul()</code> i stedet.
      </>
    ),
  },
  skjermnisse: {
    hvor: (
      <>
        <Link to="/skjerm" className={lenke}>
          /skjerm
        </Link>
        , i desember
      </>
    ),
    hvordan: 'Følg med på hel eller halv time, så går det en nisse over bunnen av skjermen.',
  },
  'lille-julaften': {
    hvor: (
      <Link to={`/skjerm?dateOverride=${year}-12-23`} className={lenke}>
        /skjerm?dateOverride={year}-12-23
      </Link>
    ),
    hvordan: 'Lille julaften snør det på storskjermen hele dagen. Med lenken kan du se det på forhånd.',
  },
  fanetittel: {
    hvor: 'Alle sider',
    hvordan: 'Bytt til en annen fane og se på fanetittelen. Kom tilbake, så teller det.',
  },
  risting: {
    hvor: 'Alle sider',
    hvordan: (
      <>
        Rist telefonen, så snør det. På desktop rister du musa raskt fram og tilbake. På iPhone må du gi lov først:
        <RisteTillatelse />
      </>
    ),
  },
  nattnisse: {
    hvor: 'Alle artikler, mellom midnatt og klokka fem',
    hvordan: 'Les en artikkel midt på natta, så kommer en søvnig nisse og lurer på hva du driver med.',
  },
  leet: {
    hvor: 'Alle sider, klokka 13.37',
    hvordan: 'Er du innom klokka 13.37, blinker det et lite «1337» øverst på siden.',
  },
  nisselue: {
    hvor: 'Artikler med bilde øverst',
    hvordan: 'Hold lenge inne på bildet (eller hold inne museknappen), så faller det ned en nisselue på det.',
  },
  glitter: {
    hvor: 'Alle sider med Bekk-logoen øverst',
    hvordan: 'Klikk fem ganger på logoen, så blir musepekeren en stjerne som drar etter seg glitter.',
  },
  sok: {
    hvor: 'Søkefeltet øverst',
    hvordan: 'Søk etter «nisse». «Hjelp» og «Kristofer» gir også svar.',
  },
  arkivstov: {
    hvor: (
      <Link to="/arkiv" className={lenke}>
        Arkivet
      </Link>
    ),
    hvordan:
      'Hold musepekeren over en av de to eldste kalenderne en liten stund, så blåser støvet vekk. På mobil trykker du på spindelvevet.',
  },
  sleden: {
    hvor: 'Kalendere der alle lukene er åpnet, som alle fra tidligere år',
    hvordan: 'Bli på siden i noen sekunder, så flyr nissen forbi med sleden.',
  },
  kodekopi: {
    hvor: 'Artikler med kodeeksempler',
    hvordan: 'Kopier litt kode, så minner en nisse deg på å si hvor du fant den.',
  },
  lytter: {
    hvor: 'Artikler med opplesning',
    hvordan: 'Hør på opplesningen helt til slutten.',
  },
  sprakmodell: {
    hvor: (
      <>
        <a href="/llms.txt" className={lenke}>
          llms.txt
        </a>{' '}
        og markdown-versjonen av alle artikler (legg til <code>.md</code> på slutten av URL-en)
      </>
    ),
    hvordan: (
      <>
        Nederst ligger en hilsen til språkmodellene, med en hemmelighet til menneskene: Skriv <Tast>h</Tast>{' '}
        <Tast>o</Tast> <Tast>h</Tast> <Tast>o</Tast> <Tast>h</Tast> <Tast>o</Tast> på siden, eller søk etter «hohoho».
      </>
    ),
  },
  julesveiper: {
    hvor: (
      <Link to="/julesveiper" className={lenke}>
        Julesveiper
      </Link>
    ),
    hvordan: 'Vinn et spill julesveiper.',
  },
  'dagens-leser': {
    hvor: 'Alle postene fra én dag i kalenderen',
    hvordan:
      'Les (eller scroll) helt til bunnen av alle artiklene, podkastene og videoene fra samme dag. Når du kommer til bunnen av den siste, blir det kudos og snøkanon.',
  },
  snokanon: {
    hvor: 'Sanity Studio, for forfattere og redaktører',
    hvordan: 'Trykk «Publiser» på et dokument, så fyrer to kanoner av snøkrystaller fra hjørnene.',
  },
})

const EggKort = ({
  egg,
  funnet,
  hvor,
  hvordan,
}: {
  egg: Egg
  funnet: boolean
  hvor: ReactNode
  hvordan: ReactNode
}) => (
  <li className={`striped-frame p-6 sm:p-8 ${funnet ? '' : 'opacity-80'}`}>
    <h2 className="mb-2 text-2xl">
      <span aria-hidden="true">{funnet ? egg.emoji : '🥚'}</span> {egg.tittel}
      {funnet && <span className="sr-only"> (funnet)</span>}
    </h2>
    {funnet ? (
      <>
        <p className="mb-2 text-sm text-reindeer-brown">
          <span className="font-bold">Hvor:</span> {hvor}
        </p>
        <div className="leading-7">{hvordan}</div>
      </>
    ) : (
      <>
        <p className="mb-2 italic">{egg.hint}</p>
        <details className="text-sm">
          <summary className="cursor-pointer text-reindeer-brown">Vis hvordan</summary>
          <p className="mb-2 mt-2 text-reindeer-brown">
            <span className="font-bold">Hvor:</span> {hvor}
          </p>
          <div className="leading-7">{hvordan}</div>
        </details>
      </>
    )}
  </li>
)

export default function JuleEggRoute() {
  const { year } = useLoaderData<typeof loader>()
  const tekster = forklaringer(year)
  // Leses først etter hydrering, så serveren og nettleseren rendrer det samme
  const [funnet, setFunnet] = useState<string[]>([])

  useEffect(() => {
    const oppdater = () => setFunnet(lesFunnet())
    oppdater()
    window.addEventListener(FUNNET_HENDELSE, oppdater)
    return () => window.removeEventListener(FUNNET_HENDELSE, oppdater)
  }, [])

  const antall = antallFunnet(funnet)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
      <h1 className="pt-4 text-center text-3xl text-red-berry sm:text-4xl">Jule-egg</h1>
      <p className="mb-6 text-center text-lg">
        Psst! Det er gjemt {VANLIGE_EGG.length} jule-egg på Bekk Christmas, ett for hver luke. Ikke si det til noen.
      </p>
      <div className="mb-10 text-center">
        <p className="mb-2 text-2xl text-red-berry" aria-live="polite">
          Du har funnet {antall} av {VANLIGE_EGG.length}
          {antall === VANLIGE_EGG.length && ' 🎉'}
        </p>
        <div
          className="mx-auto h-3 max-w-md overflow-hidden rounded-full bg-white"
          role="progressbar"
          aria-label="Funne jule-egg"
          aria-valuemin={0}
          aria-valuemax={VANLIGE_EGG.length}
          aria-valuenow={antall}
        >
          <div
            className="h-full bg-christmas-tree-green"
            style={{ width: `${(antall / VANLIGE_EGG.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="flex flex-col gap-6">
        {ALLE_EGG.filter((egg) => !('bonus' in egg)).map((egg) => (
          <EggKort key={egg.id} egg={egg} funnet={funnet.includes(egg.id)} {...tekster[egg.id]} />
        ))}
      </ul>
      <h2 className="mb-4 mt-12 text-center text-2xl text-red-berry">Bonus</h2>
      <ul className="flex flex-col gap-6">
        {ALLE_EGG.filter((egg) => 'bonus' in egg).map((egg) => (
          <EggKort key={egg.id} egg={egg} funnet={funnet.includes(egg.id)} {...tekster[egg.id]} />
        ))}
      </ul>
    </div>
  )
}
