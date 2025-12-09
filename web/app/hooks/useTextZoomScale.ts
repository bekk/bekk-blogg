import { useState, useEffect } from 'react'

export function useTextZoomScale(): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const calculateScale = () => {
      const baseFontSize = 16
      const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const newScale = currentFontSize / baseFontSize
      if (newScale !== scale) setScale(newScale)
    }

    calculateScale()

    window.addEventListener('resize', calculateScale)

    const resizeObserver = new ResizeObserver(calculateScale)
    resizeObserver.observe(document.documentElement)

    return () => {
      window.removeEventListener('resize', calculateScale)
      resizeObserver.disconnect()
    }
  }, [scale])

  return scale
}
