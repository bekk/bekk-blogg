import { Link } from 'react-router'
import { MetaFunction } from '@vercel/remix'

import { GreenGiftRedRibbon } from '~/features/archive/svgs/GreenGiftRedRibbon'
import { GreenGiftRedRibbonH } from '~/features/archive/svgs/GreenGiftRedRibbonH'
import { RedGiftWhiteRibbon } from '~/features/archive/svgs/RedGiftWhiteRibbon'
import { RedGiftWhiteRibbonV } from '~/features/archive/svgs/RedGiftWhiteRibbonV'
import { WhiteGiftGreenRibbon } from '~/features/archive/svgs/WhiteGiftGreenRibbon'
import { WhiteGiftRedRibbon } from '~/features/archive/svgs/WhiteGiftRedRibbon'
import { WhiteGiftRedRibbonH } from '~/features/archive/svgs/WhiteGiftRedRibbonH'
import { WhiteGiftRedRibbonSquare } from '~/features/archive/svgs/WhiteGiftRedRibbonSquare'
import { YearBadge } from '~/features/archive/YearBadge'
import Header from '~/features/header/Header'

export const meta: MetaFunction = () => {
  const title = `Julekalendere fra Bekk Christmas`
  const description = `Se alle julekalendere fra Bekk Christmas opp gjennom tidene`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bekk Christmas' },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@livetibekk' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export default function ArchiveRoute() {
  let currentYear = new Date().getFullYear()
  if (new Date().getMonth() < 11) {
    currentYear -= 1
  }

  const startYear = 2017
  const availableYears: number[] = []

  for (let i = currentYear; i >= startYear; i--) {
    availableYears.push(i)
  }

  const giftSVGList = [
    WhiteGiftRedRibbon,
    RedGiftWhiteRibbon,
    WhiteGiftGreenRibbon,
    GreenGiftRedRibbon,
    GreenGiftRedRibbonH,
    WhiteGiftRedRibbonH,
    RedGiftWhiteRibbonV,
    WhiteGiftRedRibbonSquare,
  ]

  const giftList = []
  for (let i = 0; availableYears.length > i; i++) {
    giftList.push(giftSVGList[i % 8])
  }

  return (
    <div className="bg-brick-wall-with-wooden-plank">
      <header className="relative">
        <Header />
      </header>
      <div className="flex flex-col justify-center">
        <h1 className="text-white text-center">Arkiv</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 items-end pt-20 w-full">
          {giftList.map((GiftSVG, index) => {
            return (
              <div className="grid justify-items-center w-full pt-8" key={index}>
                {/*Mobile*/}
                <div className="flex flex-col w-full lg:hidden">
                  <Link
                    to={`/post/${availableYears[index]}`}
                    className="flex justify-center"
                    aria-label={`Julekalender fra ${availableYears[index]}`}
                  >
                    <GiftSVG />
                  </Link>
                  <Plank year={availableYears[index]} />
                </div>
                {/*Desktop*/}
                <div className="hidden lg:block">
                  <Link to={`/post/${availableYears[index]}`} aria-label={`Julekalender fra ${availableYears[index]}`}>
                    <GiftSVG />
                  </Link>
                </div>
              </div>
            )
          })}
          {availableYears.map((_, index) => {
            if (index % 4 === 0) {
              const rowStart = 2 * (index / 4) + 2
              return (
                <div
                  key={index}
                  className={`col-start-1 row-start-${rowStart} col-span-4 justify-self-stretch hidden lg:block`}
                >
                  <BigPlank years={availableYears.slice(index, index + 4)} />
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

const BigPlank = ({ years }: { years: number[] }) => (
  <div className="bg-plank py-10 grid grid-cols-1 lg:grid-cols-4 justify-items-center">
    {years.map((year, i) => (
      <YearBadge year={year} key={i} />
    ))}
  </div>
)
const Plank = ({ year }: { year: number }) => (
  <div className={'bg-plank p-10 justify-self-stretch'}>
    <YearBadge year={year} />
  </div>
)
