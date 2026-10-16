/**
 * Hvordan nissen bak en lukket luke reagerer, etter hvor mange ganger man har klikket på den.
 * Han blir mer og mer sassy, og ved klikk nummer 50 får man se rumpa hans.
 */
export type Stadium = 'kikk' | 'nei' | 'liste' | 'sur' | 'rumpe'

export const KLIKK_FOR_RUMPE = 50

export const stadiumFor = (klikk: number): Stadium | null => {
  if (klikk >= KLIKK_FOR_RUMPE) return 'rumpe'
  if (klikk >= 35) return 'sur'
  if (klikk >= 20) return 'liste'
  if (klikk >= 10) return 'nei'
  if (klikk >= 3) return 'kikk'
  return null
}

const replikker: Record<Stadium, (luke: number) => string[]> = {
  kikk: () => [],
  nei: (luke) => [
    'Nei.',
    'Nei, nei, nei.',
    `Ikke før den ${luke}.!`,
    'Tålmodighet er en dyd, vet du.',
    'Hva er det du ikke skjønner?',
  ],
  liste: () => [
    'Hva heter du igjen?',
    'Skriver deg på lista …',
    'S-L-E-M. Sånn.',
    'Med understrek.',
    'Sånn. Nå står du på slemmelista.',
  ],
  sur: () => ['Seriøst?', 'Jeg ringer Rudolf.', 'Du får kull i år.', 'Nå begynner jeg å bli sur.', 'Siste advarsel!'],
  rumpe: () => ['God jul!'],
}

/** Hva nissen sier ved et gitt klikk, eller null om han ikke sier noe */
export const replikkFor = (klikk: number, luke: number): string | null => {
  const stadium = stadiumFor(klikk)
  if (!stadium) return null
  const linjer = replikker[stadium](luke)
  return linjer.length ? linjer[klikk % linjer.length] : null
}
