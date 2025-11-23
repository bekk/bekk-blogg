import { ReactNode } from 'react'
import { Link } from 'react-router'

type TextLinkProps = {
  href?: string
  children: ReactNode
  className?: string
}

/** Link to be used with inline text
 *
 * Will automatically pick the correct link format based on whether it's internal or external
 */
export const TextLink = ({ href, children, className, ...rest }: TextLinkProps) => {
  if (!href) {
    return <>{children}</>
  }

  if (/^(mailto:|https?:\/\/)/.test(href)) {
    return (
      <a className={['underline hover:no-underline', className].join(' ')} href={href} rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={['underline hover:no-underline', className].join(' ')} {...rest}>
      {children}
    </Link>
  )
}
