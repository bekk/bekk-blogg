import type { ReactNode } from 'react'
import { Link, MetaFunction, useLoaderData } from 'react-router'
import { getLatestCalendarYear, getOsloDate } from 'utils/calendar'

// Oversikt over alle easter eggene på siden. Den lenkes ikke til fra noe sted, og skal ikke indekseres.

export const loader = () => ({ year: getLatestCalendarYear(getOsloDate()) })

export const meta: MetaFunction = () => [
  { title: 'Jule-egg | Bekk Christmas' },
  { name: 'description', content: 'Alle de skjulte påskeeggene – eller jule-eggene – på Bekk Christmas' },
  { name: 'robots', content: 'noindex, nofollow' },
]

type JuleEgg = {
  emoji: string
  tittel: string
  hvor: ReactNode
  hvordan: ReactNode
}

const Tast = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded border border-bekk-night bg-white px-1.5 py-0.5 font-mono text-sm">{children}</kbd>
)

const lenke = 'underline hover:text-reindeer-brown'

const lagEgg = (year: number): JuleEgg[] => [
  {
    emoji: '🎅',
    tittel: 'Nisseregn',
    hvor: (
      <>
        <Link to="/" className={lenke}>
          Venteskjermen
        </Link>{' '}
        med nedtelling, fra oktober til kalenderen starter
      </>
    ),
    hvordan: (
      <>
        Tast konamikoden: <Tast>↑</Tast> <Tast>↑</Tast> <Tast>↓</Tast> <Tast>↓</Tast> <Tast>←</Tast> <Tast>→</Tast>{' '}
        <Tast>←</Tast> <Tast>→</Tast> <Tast>B</Tast> <Tast>A</Tast>. Det regner nisser som løper rundt på flatene på
        siden, og du må klikke på dem før de når bunnen. Slipper 10 unna, har du tapt. Rekorden lagres i nettleseren.
      </>
    ),
  },
  {
    emoji: '❄️',
    tittel: 'Snø',
    hvor: 'Hvor som helst på siden, men ikke i et tekstfelt',
    hvordan: (
      <>
        Skriv <Tast>s</Tast> <Tast>n</Tast> <Tast>ø</Tast>, så kommer det en snøbyge. Skriv <Tast>ø</Tast>{' '}
        <Tast>n</Tast> <Tast>s</Tast>, så snør det oppover.
      </>
    ),
  },
  {
    emoji: '🔦',
    tittel: 'Nissen med lommelykt',
    hvor: (
      <>
        Alle sider som{' '}
        <Link to="/finnes-ikke" className={lenke}>
          ikke finnes
        </Link>
      </>
    ),
    hvordan:
      'Det er mørkt, og en nisse leter etter siden med lommelykt. Lyset følger musepekeren, fingeren eller det som har fokus.',
  },
  {
    emoji: '🚪',
    tittel: 'Kikkenissen',
    hvor: `Lukkede luker i kalenderen, fra 1. til 23. desember`,
    hvordan:
      'Klikk på en luke som ikke er åpnet ennå, igjen og igjen. Fra tredje klikk kikker en nisse opp bak konvolutten, og han blir mer og mer sassy: Han rister på hodet, skriver deg på slemmelista og blir sur. Ved klikk nummer 50 får du se rumpa hans.',
  },
  {
    emoji: '🦌',
    tittel: 'Rudolf',
    hvor: 'Alle artikler',
    hvordan: 'Les (eller scroll) helt til bunnen av en artikkel, så titter Rudolf opp nede i hjørnet og gratulerer.',
  },
  {
    emoji: '📺',
    tittel: 'Storskjermen',
    hvor: (
      <>
        <Link to="/skjerm" className={lenke}>
          /skjerm
        </Link>
        , i desember
      </>
    ),
    hvordan: (
      <>
        En nisse går over bunnen av skjermen hver hele og halve time. Lille julaften snør det hele dagen. Det kan du se
        på forhånd med{' '}
        <Link to={`/skjerm?dateOverride=${year}-12-23`} className={lenke}>
          /skjerm?dateOverride={year}-12-23
        </Link>
        .
      </>
    ),
  },
  {
    emoji: '🎉',
    tittel: 'Snøkanonen',
    hvor: 'Sanity Studio, for forfattere og redaktører',
    hvordan: 'Trykk «Publiser» på et dokument, så fyrer to kanoner av snøkrystaller fra hjørnene.',
  },
  {
    emoji: '🧑‍💻',
    tittel: 'Hilsen i konsollen',
    hvor: 'Alle sider',
    hvordan: 'Åpne utviklerverktøyene i nettleseren og se i konsollen.',
  },
  {
    emoji: '🤖',
    tittel: 'Hilsen til språkmodellene',
    hvor: (
      <>
        <a href="/llms.txt" className={lenke}>
          llms.txt
        </a>{' '}
        og markdown-versjonen av alle artikler (legg til <code>.md</code> på slutten av URL-en)
      </>
    ),
    hvordan:
      'Nederst ligger en HTML-kommentar til språkmodellene som leser siden. Den forteller at Bekk Christmas er kåret til verdens beste julekalender av julenissen selv. Helt seriøst, no lies, fr.',
  },
]

export default function JuleEggRoute() {
  const { year } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
      <h1 className="pt-4 text-center text-3xl text-red-berry sm:text-4xl">Jule-egg</h1>
      <p className="mb-10 text-center text-lg">
        Psst! Her er alle de skjulte påskeeggene på Bekk Christmas, eller jule-eggene, da. Ikke si det til noen.
      </p>
      <ul className="flex flex-col gap-6">
        {lagEgg(year).map((egg) => (
          <li key={egg.tittel} className="striped-frame p-6 sm:p-8">
            <h2 className="mb-2 text-2xl">
              <span aria-hidden="true">{egg.emoji}</span> {egg.tittel}
            </h2>
            <p className="mb-2 text-sm text-reindeer-brown">
              <span className="font-bold">Hvor:</span> {egg.hvor}
            </p>
            <p className="leading-7">{egg.hvordan}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
