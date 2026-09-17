/**
 * Merkevareikoner for sosiale medier.
 *
 * lucide-react fjernet alle merkevareikoner i v1 (GithubIcon, InstagramIcon,
 * LinkedinIcon, TwitterIcon m.fl.) av varemerkehensyn. Ikonene under er derfor
 * inlinet, og følger samme størrelse- og fargekonvensjon som lucide: 24x24,
 * `currentColor`, og størrelse styrt utenfra med Tailwind-klasser.
 */

type BrandIconProps = {
  className?: string
}

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
  focusable: false,
} as const

export const GithubIcon = ({ className }: BrandIconProps) => (
  <svg {...baseProps} className={className} width="24" height="24">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.4 5 18.4 5.3 18.4 5.3c.6 1.7.2 2.9.1 3.2a4.5 4.5 0 0 1 1.2 3.1c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
)

export const InstagramIcon = ({ className }: BrandIconProps) => (
  <svg {...baseProps} className={className} width="24" height="24">
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.7.8 1 1.4.1.4.3 1 .4 2.2v9.4c-.1 1.2-.3 1.8-.4 2.2-.3.6-.5 1-1 1.4-.4.5-.8.7-1.4 1-.4.1-1 .3-2.2.4H7.1c-1.2-.1-1.8-.3-2.2-.4-.6-.3-1-.5-1.4-1-.5-.4-.7-.8-1-1.4-.1-.4-.3-1-.4-2.2V7.1c.1-1.2.3-1.8.4-2.2.3-.6.5-1 1-1.4.4-.5.8-.7 1.4-1 .4-.1 1-.3 2.2-.4 1.3 0 1.7-.1 4.9-.1Zm0 5.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
  </svg>
)

export const LinkedinIcon = ({ className }: BrandIconProps) => (
  <svg {...baseProps} className={className} width="24" height="24">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5ZM19 19h-3v-4.4c0-1-.4-1.8-1.4-1.8-.8 0-1.2.5-1.4 1a1.8 1.8 0 0 0-.1.7V19h-3v-9h3v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.2 1.3 3.2 4V19Z" />
  </svg>
)

export const TwitterIcon = ({ className }: BrandIconProps) => (
  <svg {...baseProps} className={className} width="24" height="24">
    <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3-5.8 7.3H2.9l7.5-8.6L2.5 2h6.6l4.5 6.7L18.9 2Zm-1.1 18.2h1.7L7.3 3.7H5.5l12.3 16.5Z" />
  </svg>
)
