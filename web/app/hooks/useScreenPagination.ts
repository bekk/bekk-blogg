import { useEffect, useMemo, useRef, useState } from 'react'

export function useScreenPagination<T>(
  posts: readonly T[],
  articleAmount: number | undefined,
  articlePage: number,
  rotationIntervalMs: number
) {
  const effectiveAmount = useMemo(() => articleAmount ?? posts.length, [articleAmount, posts.length])
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(posts.length / effectiveAmount)),
    [posts.length, effectiveAmount]
  )

  const [currentPage, setCurrentPage] = useState(Math.min(articlePage, totalPages - 1))
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!articleAmount || totalPages <= 1) return

    const intervalSeconds = Math.floor(rotationIntervalMs / 1000)
    const nowSeconds = Math.floor(Date.now() / 1000)
    const untilBoundary = intervalSeconds - (nowSeconds % intervalSeconds)

    timeoutRef.current = setTimeout(() => {
      setCurrentPage((page) => (page + 1) % totalPages)
      intervalRef.current = setInterval(() => {
        setCurrentPage((page) => (page + 1) % totalPages)
      }, rotationIntervalMs)
    }, untilBoundary * 1000)

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [articleAmount, totalPages, rotationIntervalMs])

  const start = currentPage * effectiveAmount
  const end = start + effectiveAmount
  const visiblePosts = useMemo(() => posts.slice(start, end), [posts, start, end])

  return { visiblePosts, currentPage, totalPages, effectiveAmount }
}
