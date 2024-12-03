import { useEffect, useState } from 'react'

const Snowflake = ({ size, left, duration }: { size: number; left: number; duration: number }) => {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        top: `0px`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `fall ${duration}s linear infinite`,
        zIndex: 15,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path
        fill="#fff"
        d="m75.606 50.843-1.81-5.036-.002.007-4.622-1.505-.403 1.238.405-1.245-1.376.932-4.537-1.48 4.465-4.007.01.012-.182-3.029-2.993-.503-5.786 5.19-6.65-2.167-1.462-6.914 5.246-4.706 7.34 2.389 2.533-1.675-1.06-2.843-.002.018-5.698-1.856 3.556-3.194 1.618.29.005.005 3.618-3.246-3.095-3.439 3.09 3.437-.382-5.338-5.27-.95.004.003-3.618 3.246-.005-.006.118 1.657-3.55 3.189-1.24-5.865-4.64.98 1.606 7.595-5.29 4.749-6.54-2.13-1.45-6.86 5.785-5.192-3.166-3.52-4.465 4.006-.986-4.666 1.073-1.266-.006.001-1.004-4.751.006-.002L29.976.06l-3.46 4.087-.01.002 1.004 4.751.01-.002 1.475.715.988 4.675-5.698-1.856.007-.015-2.537 1.673 1.06 2.842 7.336 2.39 1.462 6.914-5.1 4.58-6.79-2.213-1.605-7.595-4.636.98 1.239 5.864-4.54-1.48-.563-1.561-.888 2.722-.427 1.303 1.313-4.018-4.619-1.506.003-.004L.56 26.308l1.81 5.036-.003.004 4.622 1.505.002-.007 1.363-.919 4.547 1.481-4.46 4.002-.013-.013.181 3.028 2.998.506 5.742-5.154 6.762 2.203 1.448 6.85-5.254 4.715-7.387-2.406-1.47 4.5 5.704 1.858-3.553 3.19-1.636-.296.004.006-3.618 3.246-.004-.006.383 5.338 5.273.949-2.548-2.83 2.552 2.836 3.615-3.246-.005-.006-.116-1.636 3.56-3.194 1.237 5.858-.016.003 2.715 1.357 1.937-2.34-1.594-7.543 5.287-4.746 6.552 2.135 1.46 6.913-5.742 5.154.18 3.029 2.997.503-.012-.011 4.46-4.002.987 4.675-1.06 1.25-.009.002 1.004 4.752.01-.002 4.818 2.337 3.46-4.087-.006.002-1.004-4.752.006-.001-1.493-.724-.986-4.666 5.704 1.858 1.47-4.5-7.39-2.409-1.45-6.86 5.149-4.616 6.722 2.191 1.594 7.544 2.718 1.356 1.938-2.34-.017.003-1.237-5.858 4.544 1.482.555 1.544-.001.007 4.622 1.505 1.183-3.626-1.181 3.619 4.435-3Z"
      />
    </svg>
  )
}

export const SnowAnimation = () => {
  const [flakes, setFlakes] = useState<{ id: number; size: number; left: number; duration: number }[]>([])
  const [maxFlakes, setMaxFlakes] = useState(50)

  useEffect(() => {
    const updateMaxFlakes = () => {
      if (window.innerWidth <= 760) {
        setMaxFlakes(20)
      } else {
        setMaxFlakes(50)
      }
    }

    updateMaxFlakes()
    window.addEventListener('resize', updateMaxFlakes)

    return () => window.removeEventListener('resize', updateMaxFlakes)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (flakes.length < maxFlakes) {
        const newFlake = {
          id: Date.now(),
          size: Math.random() * 40 + 10,
          left: Math.random() * 100,
          duration: Math.random() * 10 + 5,
        }

        setFlakes((prevFlakes) => [...prevFlakes, newFlake])
      }
    }, 500)

    return () => clearInterval(interval)
  }, [flakes, maxFlakes])

  return (
    <div className="absolute w-full h-full top-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <Snowflake key={flake.id} size={flake.size} left={flake.left} duration={flake.duration} />
      ))}
    </div>
  )
}
