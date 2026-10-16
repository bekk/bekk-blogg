export type Egg = {
  id: string
  emoji: string
  tittel: string
  /** Et hint som ikke avslører for mye, vist før man har funnet egget */
  hint: string
  /** Bonusegg teller ikke med blant de 24 */
  bonus?: boolean
}

export const ALLE_EGG = [
  { id: 'nisseregn', emoji: '🎅', tittel: 'Nisseregn', hint: 'En gammel juksekode fra Nintendo-tiden.' },
  { id: 'nissefanger', emoji: '🥅', tittel: 'Nissefanger', hint: 'Når det regner nisser: fang 25 av dem i én runde.' },
  { id: 'sno', emoji: '❄️', tittel: 'Snø', hint: 'Skriv det du ønsker deg mest i desember.' },
  { id: 'sno-opp', emoji: '🙃', tittel: 'Snø oppover', hint: 'Det samme, bare baklengs.' },
  { id: 'lommelykt', emoji: '🔦', tittel: 'Nissen med lommelykt', hint: 'Gå deg vill.' },
  {
    id: 'kikkenisse',
    emoji: '🚪',
    tittel: 'Kikkenissen',
    hint: 'Fra 1. til 23. desember: Vær utålmodig med en luke som ikke er åpnet.',
  },
  {
    id: 'nisserumpa',
    emoji: '🍑',
    tittel: 'Nisserumpa',
    hint: 'Fra 1. til 23. desember: Vær veldig, veldig utålmodig.',
  },
  { id: 'rudolf', emoji: '🦌', tittel: 'Rudolf', hint: 'Les en artikkel helt ferdig.' },
  { id: 'konsoll', emoji: '🧑‍💻', tittel: 'Konsollen', hint: 'Kikk under panseret.' },
  {
    id: 'skjermnisse',
    emoji: '📺',
    tittel: 'Skjermnissen',
    hint: 'I desember: Følg med på storskjermen på halvtimen.',
  },
  {
    id: 'lille-julaften',
    emoji: '🌨️',
    tittel: 'Lille julaften på skjermen',
    hint: 'Hvordan ser storskjermen ut dagen før julaften?',
  },
  { id: 'fanetittel', emoji: '🥺', tittel: 'Fanetittelen', hint: 'Gå fra oss en liten stund.' },
  {
    id: 'risting',
    emoji: '📳',
    tittel: 'Rist meg',
    hint: 'Snøkuler blir finest når man rister dem. Det gjelder musa også.',
  },
  { id: 'nattnisse', emoji: '😴', tittel: 'Nattnissen', hint: 'Les en artikkel når du egentlig burde sove.' },
  { id: 'leet', emoji: '👾', tittel: '1337', hint: 'Kikk innom på det mest elitære klokkeslettet.' },
  { id: 'nisselue', emoji: '🧢', tittel: 'Nisselue', hint: 'Hold lenge inne på bildet øverst i en artikkel.' },
  { id: 'glitter', emoji: '✨', tittel: 'Glitterstjerne', hint: 'Klikk på Bekk-logoen. Mange ganger.' },
  { id: 'sok', emoji: '🔎', tittel: 'Søkenissen', hint: 'Søk etter den som bor på Nordpolen.' },
  {
    id: 'arkivstov',
    emoji: '🕸️',
    tittel: 'Støv i arkivet',
    hint: 'De eldste kalenderne har ikke blitt tørket støv av.',
  },
  { id: 'sleden', emoji: '🛷', tittel: 'Sleden', hint: 'Besøk en kalender der alle lukene er åpnet.' },
  { id: 'kodekopi', emoji: '📋', tittel: 'Kodekopi', hint: 'Kopier kode fra en artikkel.' },
  { id: 'lytter', emoji: '🎧', tittel: 'Lytteren', hint: 'Hør en opplesning helt til slutten.' },
  {
    id: 'sprakmodell',
    emoji: '🤖',
    tittel: 'Hilsen fra språkmodellene',
    hint: 'Les det språkmodellene leser, helt til bunnen.',
  },
  { id: 'julesveiper', emoji: '💣', tittel: 'Julesveiper', hint: 'Vinn et spill i en julete klassiker.' },
  {
    id: 'dagens-leser',
    emoji: '🏆',
    tittel: 'Dagens leser',
    hint: 'Les alt fra én dag, fra start til slutt.',
    bonus: true,
  },
  {
    id: 'snokanon',
    emoji: '🎉',
    tittel: 'Snøkanonen',
    hint: 'For forfattere: Publiser noe i Studioet.',
    bonus: true,
  },
] as const satisfies Egg[]

export type EggId = (typeof ALLE_EGG)[number]['id']

export const VANLIGE_EGG: readonly Egg[] = ALLE_EGG.filter((egg: Egg) => !egg.bonus)

export const finnEggInfo = (id: string): Egg | undefined => ALLE_EGG.find((egg) => egg.id === id)

/** Hvor mange av de vanlige eggene som er funnet */
export const antallFunnet = (funnet: string[]) => VANLIGE_EGG.filter((egg) => funnet.includes(egg.id)).length
