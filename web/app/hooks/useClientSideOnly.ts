import { useEffect, useState } from 'react'

const useClientSideOnly = () => {
  const [isClientSide, setIsClientSide] = useState(false)
  useEffect(() => {
    setIsClientSide(true)
  }, [])
  return isClientSide
}

export default useClientSideOnly
