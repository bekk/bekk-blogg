import { ReactNode } from 'react'
import { Link } from '@remix-run/react'

type TextLinkProps = {
  href?: string
  children: ReactNode
}

/** Link to be used with inline text
 *
 * Will automatically pick the correct link format based on whether it's internal or external
 */
export const TextLink = ({ href, children, ...rest }: TextLinkProps) => {
  if (!href) {
    return <>{children}</>
  }

  if (/^(mailto:|https?:\/\/)/.test(href)) {
    return (
      <a className="underline" href={href} rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  )
}
