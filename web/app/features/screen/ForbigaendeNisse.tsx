import { useEffect, useState } from 'react'
import { NisseFigur } from '~/components/NisseFigur'
import { finnEgg } from '~/features/jule-egg/lager'

/** Hvor lang tid nissen bruker over skjermen, i sekunder */
const GANGTID = 25

/** Millisekunder til neste hele eller halve time */
const tidTilNesteHalvtime = (naa: Date) => {
  const halvtime = 30 * 60 * 1000
  return halvtime - (naa.getTime() % halvtime)
}

/** Easter egg på /skjerm: hver hele og halve time går det en nisse over bunnen av skjermen */
export const ForbigaendeNisse = () => {
  const [tur, setTur] = useState<number | null>(null)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const planlegg = () => {
      timeout = setTimeout(() => {
        setTur(Date.now())
        planlegg()
      }, tidTilNesteHalvtime(new Date()))
    }
    planlegg()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (tur === null) {
      return
    }
    finnEgg('skjermnisse')
    const timeout = setTimeout(() => setTur(null), GANGTID * 1000)
    return () => clearTimeout(timeout)
  }, [tur])

  if (tur === null) {
    return null
  }

  return (
    <div
      key={tur}
      aria-hidden="true"
      data-tilstand="loper"
      data-retning="hoyre"
      className="nisse pointer-events-none fixed bottom-4 left-0 z-30 h-39 w-30 motion-reduce:hidden"
      style={{ animation: `nisse-gar-forbi ${GANGTID}s linear both` }}
    >
      <div className="nisse-kropp size-full">
        <NisseFigur />
      </div>
    </div>
  )
}
