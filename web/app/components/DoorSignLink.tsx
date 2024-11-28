import { Link } from '@remix-run/react'

type Props = {
  link: string
  children: React.ReactNode
}

export const DoorSignLink = ({ link, children }: Props) => {
  return (
    <Link
      to={link}
      className="h-[61px] w-[283px] 2lg:h-[74px] 2lg:w-[340px] flex justify-center items-center bg-[url('/images/doorsign.svg')] focus-visible:bg-[url('/images/doorsign_focus.svg')] focus-visible:text-light-brown active:text-dark-brown bg-contain bg-no-repeat text-base 2lg:text-lg text-black hover:underline focus-visible:no-underline"
    >
      {children}
    </Link>
  )
}
