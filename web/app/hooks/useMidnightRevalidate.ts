import { useEffect, useRef } from 'react'
import { useRevalidator } from 'react-router'

export function useMidnightRevalidate(hasDateOverride: boolean) {
  const revalidator = useRevalidator()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (hasDateOverride) return

    const schedule = () => {
      timeoutRef.current = setTimeout(() => {
        revalidator.revalidate()
        schedule()
      }, msUntilNextUtcMidnightWithBuffer(30_000))
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

const msUntilNextUtcMidnightWithBuffer = (bufferMs = 30_000) => {
  const now = new Date()
  const next = new Date(now)
  next.setUTCHours(24, 0, 0, 0)
  return Math.max(0, next.getTime() - now.getTime() + bufferMs)
}
