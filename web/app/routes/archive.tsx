import { Link } from '@remix-run/react'

export default function ArchivePage() {
  const currentYear = new Date().getFullYear()
  const startYear = 2017
  const availableYears = []

  for (let i = currentYear - 1; i >= startYear; i--) {
    availableYears.push(i)
  }

  return (
    <div className={'flex flex-col p-10 gap-8'}>
      <h1 className="font-delicious">Arkiv</h1>
      <div className="flex flex-col gap-8">
        {availableYears.map((year) => (
          <div key={year} className="flex">
            <Link to={`/post/${year}`} className="">
              <h3 className="hover:text-reindeer-brown">💌 Julekalender {year}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
