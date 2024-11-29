import { useRef, useState } from 'react'
import { Loader, Pause, Play } from 'lucide-react'
import { trackEvent } from 'utils/analytics'

export const AudioPlayer = ({ src, slug }: { src: string; slug: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!isInitialized && audioRef.current) {
      // Initialize audio source on first play
      audioRef.current.src = src
      setIsInitialized(true)
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        trackEvent('article_audio_played', { slug })
      }
    }
  }

  return (
    <div className="mb-6 flex items-center gap-2">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-bekk-night text-white flex items-center justify-center hover:bg-opacity-90 transition-colors"
      >
        {isLoading ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </button>
      <p className="text-md text-bekk-night">
        {isLoading ? 'Varmer opp stemmen' : isPlaying ? 'Leser høyt for deg…' : 'Høytlesning'}
      </p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption*/}
      <audio
        ref={audioRef}
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />
    </div>
  )
}
