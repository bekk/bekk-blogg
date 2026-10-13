import { useEffect, useRef } from 'react'
import { useRevalidator } from 'react-router'
import { getSecondsUntilOsloMidnight } from 'utils/calendar'

export function useMidnightRevalidate(hasDateOverride: boolean) {
  const revalidator = useRevalidator()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (hasDateOverride) return

    const schedule = () => {
      timeoutRef.current = setTimeout(() => {
        revalidator.revalidate()
        schedule()
      }, msUntilNextOsloMidnightWithBuffer(30_000))
    }

    schedule()

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [hasDateOverride, revalidator])
}

const msUntilNextOsloMidnightWithBuffer = (bufferMs = 30_000) => getSecondsUntilOsloMidnight() * 1000 + bufferMs
