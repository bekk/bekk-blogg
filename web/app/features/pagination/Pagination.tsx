import { Link } from '@remix-run/react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}

export const Pagination = ({ currentPage, totalPages, baseUrl, className = '' }: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  const renderPageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    // Always show first page
    pages.push(1)

    if (showEllipsis) {
      // Show pages around current page
      let start = Math.max(2, currentPage - 2)
      let end = Math.min(totalPages - 1, currentPage + 2)

      // Adjust range if current page is near start or end
      if (currentPage <= 4) {
        end = 5
      } else if (currentPage >= totalPages - 3) {
        start = totalPages - 4
      }

      // Add ellipsis before if needed
      if (start > 2) {
        pages.push('…')
      }

      // Add pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis after if needed
      if (end < totalPages - 1) {
        pages.push('…')
      }
    } else {
      // Show all pages if total is small
      for (let i = 2; i < totalPages; i++) {
        pages.push(i)
      }
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const getPageUrl = (page: number) => {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`
  }

  return (
    <nav className={`flex justify-center gap-2 my-8 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      {currentPage > 1 && (
        <Link
          to={getPageUrl(currentPage - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
          aria-label="Gå til forrige side"
          prefetch="intent"
        >
          ←
        </Link>
      )}

      {/* Page numbers */}
      {renderPageNumbers().map((page, index) => {
        if (page === '…') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-1">
              …
            </span>
          )
        }

        return (
          <Link
            key={page}
            to={getPageUrl(page as number)}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
            prefetch="intent"
          >
            {page}
          </Link>
        )
      })}

      {/* Next button */}
      {currentPage < totalPages && (
        <Link
          to={getPageUrl(currentPage + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
          aria-label="Gå til neste side"
          prefetch="intent"
        >
          →
        </Link>
      )}
    </nav>
  )
}
