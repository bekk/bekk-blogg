import { useMemo } from 'react'

const repeatSpinningLabel = (label: string): string => {
  const maxLength = 35
  let repeated = false
  let repeatedLabel = label

  while (repeatedLabel.length < maxLength) {
    repeated = true
    repeatedLabel += ' • ' + label
  }

  return (repeatedLabel += repeated ? ' • ' : '')
}

interface SpinningTextProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const SpinningText = ({ label, children, className }: SpinningTextProps) => {
  const repeatedLabel = useMemo(() => repeatSpinningLabel(label), [label])

  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" className="min-h-32 min-w-32 shrink-0">
        <title>{repeatedLabel}</title>
        <defs>
          <path
            d="M 75 75 m -57.5, 0 a 57.5,57.5 0 1,1 115,0 a 57.5,57.5 0 1,1 -115,0"
            id="textcircle"
            fill="none"
            stroke="none"
          />
        </defs>
        <text textDecoration="none">
          <textPath
            className="normal-case no-underline text-[14px] fill-current tracking-[1px] flex justify-evenly"
            href="#textcircle"
            xlinkHref="#textcircle"
            lengthAdjust="spacing"
            textLength={355}
            spacing="auto"
          >
            {repeatedLabel}
          </textPath>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            to="360 75 75"
            from="0 75 75"
            dur="10s"
            repeatCount="indefinite"
          />
        </text>
      </svg>

      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  )
}
