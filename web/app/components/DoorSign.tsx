import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
}

export const DoorSign = ({ children, as: Component = 'div' }: Props) => {
  return (
    <motion.div className="relative" whileHover="hover" initial="rest" animate="rest">
      <Component className="h-[61px] w-[283px] 2lg:h-[74px] 2lg:w-[340px] flex justify-center items-center bg-[url('/images/doorsign.svg')] focus-visible:bg-[url('/images/doorsign_focus.svg')] focus-visible:text-light-brown active:text-dark-brown bg-contain bg-no-repeat text-base 2lg:text-lg text-black focus-visible:no-underline">
        {children}
      </Component>
    </motion.div>
  )
}
