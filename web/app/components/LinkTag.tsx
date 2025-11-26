import { Link } from 'react-router'

interface LinkTagProps {
  linkText: string
  url: string
  className?: string
}

export const LinkTag = ({ linkText, url, className }: LinkTagProps) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link to={url} className="gift-tag text-xl text-black hover:text-reindeer-brown underline">
        {linkText}
      </Link>
    </div>
  )
}
