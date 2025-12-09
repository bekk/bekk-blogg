export const GiftsWithBadge = ({
  year,
  width = 340,
  height = 160,
  colorRibbonBigPackage,
  colorWrappingBigPackage,
  colorRibbonSmallPackage,
  colorWrappingSmallPackage,
}: {
  year: number
  width?: number
  height?: number
  colorRibbonBigPackage: string
  colorWrappingBigPackage: string
  colorRibbonSmallPackage: string
  colorWrappingSmallPackage: string
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 354 174" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M102.036 58.561C86.6015 60.9034 65.7318 57.6251 76.9961 51.8515C86.0075 47.2327 97.4444 54.4 102.036 58.561Z"
        stroke={colorRibbonSmallPackage}
        strokeWidth="3.57568"
      />
      <path
        d="M102.036 58.5608C115.151 45.8796 131.565 43.3368 130.146 50.3602C129.011 55.9788 110.933 58.1684 102.036 58.5608Z"
        stroke={colorRibbonSmallPackage}
        strokeWidth="3.57568"
      />
      <g clipPath="url(#clip0_1_9965)">
        <rect
          width="57.2108"
          height="156.436"
          transform="translate(0 174.314) rotate(-90)"
          fill={colorWrappingBigPackage}
        />
        <rect x="73.3013" y="117.103" width="9.83311" height="57.2108" fill={colorRibbonBigPackage} />
        <rect
          x="156.436"
          y="141.239"
          width="8.93921"
          height="156.436"
          transform="rotate(90 156.436 141.239)"
          fill={colorRibbonBigPackage}
        />
      </g>
      <g clipPath="url(#clip1_1_9965)">
        <rect
          width="57.2108"
          height="90.2858"
          transform="translate(51.8473 117.103) rotate(-90)"
          fill={colorWrappingSmallPackage}
        />
        <rect x="96.5432" y="59.8926" width="9.83311" height="57.2108" fill={colorRibbonSmallPackage} />
        <rect
          x="208.283"
          y="84.0283"
          width="8.93921"
          height="156.436"
          transform="rotate(90 208.283 84.0283)"
          fill={colorRibbonSmallPackage}
        />
      </g>
      <path d="M353.011 43.8019H135.345L114.422 21.9015L135.345 0.00012207H353.011V43.8019ZM123.361" fill="#F7F3EE" />
      <text
        x="240"
        y="25"
        dominantBaseline="middle"
        fontSize="30"
        textAnchor="middle"
        fill={colorRibbonSmallPackage}
        className="font-gt-expanded"
      >
        {year}
      </text>
      <path
        d="M123.361 24.136C124.348 24.136 125.149 23.3355 125.149 22.3481C125.149 21.3607 124.348 20.5603 123.361 20.5603V22.3481V24.136ZM123.361 22.3481V20.5603C118.795 20.5603 112.954 21.635 108.256 27.148C103.631 32.5755 100.373 42.0119 100.119 58.0766L101.907 58.1049L103.694 58.1332C103.943 42.4141 107.139 33.9721 110.978 29.4672C114.744 25.0478 119.378 24.136 123.361 24.136V22.3481Z"
        fill={colorRibbonSmallPackage}
      />
      <defs>
        <clipPath id="clip0_1_9965">
          <rect width="57.2108" height="156.436" fill="white" transform="translate(0 174.314) rotate(-90)" />
        </clipPath>
        <clipPath id="clip1_1_9965">
          <rect width="57.2108" height="90.2858" fill="white" transform="translate(51.8473 117.103) rotate(-90)" />
        </clipPath>
      </defs>
    </svg>
  )
}
