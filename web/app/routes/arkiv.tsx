import { Link } from '@remix-run/react'
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
  const currentYear = new Date().getFullYear()
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
  return (
    <div className="bg-brick-wall-with-wooden-plank">
      <header className="relative">
        <Header />
      </header>
      <div className={'flex flex-col justify-center'}>
        <h1 className="text-white text-center">Arkiv</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 items-end pt-20 justify-items-center w-full">
          {giftSVGList.map((GiftSVG, index) => {
            return (
              <div className="grid justify-items-center w-full pt-8" key={index}>
                {/*Mobile*/}
                <div className="flex flex-col w-full justify-items-center lg:hidden">
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
          <div className="col-start-1 row-start-2 col-span-4 justify-self-stretch hidden lg:block">
            <BigPlank years={availableYears.slice(0, 4)} />
          </div>
          <div className="col-start-1 row-start-4 col-span-4 justify-self-stretch hidden lg:block">
            <BigPlank years={availableYears.slice(4, 8)} />
          </div>
        </div>
      </div>
    </div>
  )
}

const BigPlank = ({ years }: { years: number[] }) => (
  <div className={'bg-plank p-10 justify-self-stretch flex justify-between px-24'}>
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
