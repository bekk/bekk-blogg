import { LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from 'react-router'
import { getCalendarStart, getLatestCalendarYear, getOsloDate, isTeaserPeriod, parseIsoDate } from 'utils/calendar'
import { loadQueryOptions } from 'utils/sanity/loadQueryOptions.server'

import { TeaserPage } from '~/features/teaser/TeaserPage'

export const meta: MetaFunction = () => {
  return [
    { title: 'bekk.christmas' },
    {
      name: 'description',
      content:
        'Bekk Christmas er en julekalender med innhold om teknologi, design, strategi og produktutvikling fra Bekk',
    },
    { property: 'og:image', content: 'https://www.bekk.christmas/og-image.jpg' },
    { name: 'twitter:image', content: 'https://www.bekk.christmas/og-image.jpg' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { preview } = await loadQueryOptions(request.headers)
  const today = getOsloDate()
  const { year } = parseIsoDate(today)

  // I ukene før 1. desember vises en nedtelling til årets kalender. Ellers sendes man til
  // den siste kalenderen som har startet. I preview går man rett til årets kalender.
  if (preview) {
    return redirect(`/post/${year}`)
  }
  if (!isTeaserPeriod(today)) {
    return redirect(`/post/${getLatestCalendarYear(today)}`)
  }
  return {
    launchDate: getCalendarStart(year).toISOString(),
    previousYear: getLatestCalendarYear(today),
  }
}

export default function Index() {
  const { launchDate, previousYear } = useLoaderData<typeof loader>()
  return <TeaserPage launchDate={launchDate} previousYear={previousYear} />
}
