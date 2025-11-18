import { LinkToArchive } from './LinkToArchive'

export const GiftsWithLink = () => {
  return (
    <div className="relative">
      <svg width="526" height="259" viewBox="0 0 526 259" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M151.894 87.1752C128.917 90.6622 97.8498 85.7819 114.618 77.1873C128.033 70.3116 145.058 80.981 151.894 87.1752Z"
          stroke="#ED7E87"
          strokeWidth="5.32283"
        />
        <path
          d="M151.893 87.1749C171.417 68.2974 195.851 64.5121 193.738 74.9673C192.048 83.3314 165.137 86.5908 151.893 87.1749Z"
          stroke="#ED7E87"
          strokeWidth="5.32283"
        />
        <g clipPath="url(#clip0_1_9309)">
          <rect width="85.1654" height="232.874" transform="translate(0 259.488) rotate(-90)" fill="#AEB7AB" />
          <rect x="109.118" y="174.323" width="14.6378" height="85.1654" fill="#32432D" />
          <rect
            x="232.874"
            y="210.252"
            width="13.3071"
            height="232.874"
            transform="rotate(90 232.874 210.252)"
            fill="#32432D"
          />
        </g>
        <g clipPath="url(#clip1_1_9309)">
          <rect width="85.1653" height="134.402" transform="translate(77.1811 174.323) rotate(-90)" fill="#A7060E" />
          <rect x="143.716" y="89.1574" width="14.6378" height="85.1654" fill="#ED7E87" />
          <rect
            x="310.055"
            y="125.087"
            width="13.3071"
            height="232.874"
            transform="rotate(90 310.055 125.087)"
            fill="#ED7E87"
          />
        </g>
        <path
          d="M183.638 35.9291C185.108 35.9291 186.299 34.7376 186.299 33.2677C186.299 31.7978 185.108 30.6063 183.638 30.6063V33.2677V35.9291ZM183.638 33.2677V30.6063C176.842 30.6063 168.146 32.2061 161.153 40.4129C154.267 48.4924 149.418 62.5396 149.04 86.4539L151.701 86.496L154.362 86.5381C154.732 63.1384 159.489 50.5714 165.204 43.8653C170.81 37.2864 177.709 35.9291 183.638 35.9291V33.2677Z"
          fill="#ED7E87"
        />
        <defs>
          <clipPath id="clip0_1_9309">
            <rect width="85.1654" height="232.874" fill="white" transform="translate(0 259.488) rotate(-90)" />
          </clipPath>
          <clipPath id="clip1_1_9309">
            <rect width="85.1653" height="134.402" fill="white" transform="translate(77.1811 174.323) rotate(-90)" />
          </clipPath>
        </defs>
      </svg>
      <LinkToArchive className="absolute top-3 right-24" />
    </div>
  )
}
