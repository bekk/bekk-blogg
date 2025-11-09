import { Link } from '@remix-run/react'

interface LinkToArchiveProps {
  className?: string
}

export const LinkToArchive = ({ className }: LinkToArchiveProps) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link to="/arkiv" className="gift-tag text-xl text-black hover:text-reindeer-brown underline">
        Se tidligere julekalendere
      </Link>
    </div>
  )
}
