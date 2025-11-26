import { Link, MetaFunction } from 'react-router'
import { GiftsWithBadge } from '~/features/archive/svgs/GiftsWithBadge'
import { motion } from 'framer-motion'

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

  return (
    <div className="bg-soft-pink min-h-screen">
      <header className="relative">
        <Header />
      </header>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-red-berry text-center">Arkiv</h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 md:gap-y-40 md:px-24 w-full max-w-[1800px] mb-12">
          {availableYears.map((_, index) => {
            const colorRibbonBigPackage = index % 2 ? '#32432D' : '#AEB7AB'
            const colorWrappingBigPackage = index % 2 ? '#AEB7AB' : '#32432D'

            const colorRibbonSmallPackage = index % 2 ? '#ED7E87' : '#6D0D22'
            const colorWrappingSmallPackage = index % 2 ? '#A7060E' : '#ED7E87'
            return (
              <div className="grid justify-items-center w-full pt-8" key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link to={`/post/${availableYears[index]}`} aria-label={`Julekalender fra ${availableYears[index]}`}>
                    <GiftsWithBadge
                      year={availableYears[index]}
                      colorRibbonBigPackage={colorRibbonBigPackage}
                      colorWrappingBigPackage={colorWrappingBigPackage}
                      colorRibbonSmallPackage={colorRibbonSmallPackage}
                      colorWrappingSmallPackage={colorWrappingSmallPackage}
                    />
                  </Link>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
