import { Link } from '@remix-run/react'

export const LinkToArchive = () => {
  return (
    <div className="flex justify-center mt-16">
      <Link to={'/archive'} className="text-xl text-black hover:text-reindeer-brown underline">
        Se tidligere julekalendere
      </Link>
    </div>
  )
}