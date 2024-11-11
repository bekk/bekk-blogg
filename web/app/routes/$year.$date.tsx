import { useLoaderData } from '@remix-run/react'

export async function loader({ params }: { params: { year: string; date: string } }) {
  return { year: params.year, date: params.date }
}

export default function Index() {
  const data = useLoaderData<{ year: string; date: string }>()
  return (
    <div>
      <h1>Luke: {data.date} i {data.year}</h1>
    </div>
  )
}