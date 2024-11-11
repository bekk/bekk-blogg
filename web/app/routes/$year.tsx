import { Outlet, useLoaderData } from '@remix-run/react'

export async function loader({ params }: { params: { year: string } }) {
  const year = parseInt(params.year)
  const currentYear = new Date().getFullYear()

  //TODO: finne ut av når første bekk-christmas posten kommer fra
  if (isNaN(year) || year > currentYear || year < 2015) {
    throw new Response('Invalid year', { status: 404 })
  }
  return { year: params.year }
}

export default function YearRoute() {
  const data = useLoaderData<{ year: string }>()
  return (
    <div>Velkommen til {data.year}
      <Outlet />
    </div>
  )
}