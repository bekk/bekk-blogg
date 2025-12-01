import { Link } from 'react-router'
import { motion } from 'framer-motion'

type Props = {
  link: string
  children: React.ReactNode
}

export const DoorSignLink = ({ link, children }: Props) => {
  return (
    <motion.div className="relative" whileHover="hover" initial="rest" animate="rest">
      <Link
        to={link}
        className="h-[61px] w-[283px] 2lg:h-[74px] 2lg:w-[340px] flex justify-center items-center bg-[url('/images/doorsign.svg')] focus-visible:bg-[url('/images/doorsign_focus.svg')] focus-visible:text-light-brown active:text-dark-brown bg-contain bg-no-repeat text-base 2lg:text-lg text-black hover:underline focus-visible:no-underline"
      >
        {children}
      </Link>
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 pointer-events-none"
        variants={{
          rest: { opacity: 0, x: '-10%' },
          hover: { opacity: 0.5, x: '10%', transition: { duration: 0.3 } },
        }}
        style={{ mixBlendMode: 'overlay' }}
      />
    </motion.div>
  )
}
