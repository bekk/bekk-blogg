/** Toppkanten til noe nissene kan løpe på, i viewport-koordinater */
export type Flate = { venstre: number; hoyre: number; topp: number }

export type Nisse = {
  id: number
  /** Midt under føttene */
  x: number
  y: number
  /** Løpefart, negativ når nissen løper mot venstre */
  vx: number
  vy: number
  /** Indeksen til flaten nissen står på, eller null når den faller */
  flate: number | null
}

const TYNGDEKRAFT = 1600
/** Hvor mye av løpefarten nissen beholder sidelengs mens den faller */
const SIDEFART_I_FALL = 0.3
/** Det lille hoppet når nissen løper utfor en kant */
const HOPP = -260

type Omgivelser = {
  flater: Flate[]
  /** Bredden på viewporten, der nissene snur */
  bredde: number
  /** Maks fallfart, som øker utover i spillet */
  fallfart: number
}

const erGyldig = (flate: Flate | undefined): flate is Flate => flate !== undefined && flate.hoyre - flate.venstre > 0

/** Flytter en nisse `dt` sekunder fram i tid */
export const steg = (nisse: Nisse, dt: number, { flater, bredde, fallfart }: Omgivelser): Nisse => {
  const flate = nisse.flate === null ? undefined : flater[nisse.flate]

  if (erGyldig(flate)) {
    let x = nisse.x + nisse.vx * dt
    let vx = nisse.vx
    if (x < 0 || x > bredde) {
      vx = -vx
      x = Math.min(Math.max(x, 0), bredde)
    }
    if (x < flate.venstre || x > flate.hoyre) {
      return { ...nisse, x, vx, y: flate.topp, vy: HOPP, flate: null }
    }
    return { ...nisse, x, vx, y: flate.topp, vy: 0 }
  }

  const vy = Math.min(nisse.vy + TYNGDEKRAFT * dt, fallfart)
  const y = nisse.y + vy * dt
  let x = nisse.x + nisse.vx * SIDEFART_I_FALL * dt
  let vx = nisse.vx
  if (x < 0 || x > bredde) {
    vx = -vx
    x = Math.min(Math.max(x, 0), bredde)
  }

  if (vy > 0) {
    // Lander på den øverste flaten nissen passerer i løpet av steget
    let landing: number | null = null
    flater.forEach((kandidat, indeks) => {
      const treffer =
        erGyldig(kandidat) &&
        x >= kandidat.venstre &&
        x <= kandidat.hoyre &&
        nisse.y <= kandidat.topp &&
        y >= kandidat.topp
      if (treffer && (landing === null || kandidat.topp < flater[landing].topp)) {
        landing = indeks
      }
    })
    if (landing !== null) {
      return { ...nisse, x, vx, y: flater[landing].topp, vy: 0, flate: landing }
    }
  }

  return { ...nisse, x, y, vx, vy, flate: null }
}

/** Om nissen har nådd bunnen av skjermen */
export const harNaddBunnen = (nisse: Nisse, hoyde: number) => nisse.y > hoyde
