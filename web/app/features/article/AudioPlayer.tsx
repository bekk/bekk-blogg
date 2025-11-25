import { Loader, Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'
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
        className="w-12 h-12 rounded-full bg-red-berry text-white flex items-center justify-center hover:bg-opacity-90 transition-colors"
        aria-label={isLoading ? 'Varmer opp stemmen' : isPlaying ? 'Stopp høytlesning' : 'Start høytlesning'}
      >
        {isLoading ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>
      <p className="text-md text-red-berry">
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
