import { useEffect } from 'react'
import { trackEvent } from 'utils/analytics'
import { Button } from '~/components/ui/button'

type GameHeaderProps = {
  gameStatus: 'playing' | 'won' | 'lost'
  onReset: () => void
  onSantaHelper: () => void
  santaHelperAvailable: boolean
}

export function GameHeader({ gameStatus, onReset, onSantaHelper, santaHelperAvailable }: GameHeaderProps) {
  useEffect(() => {
    if (gameStatus === 'won') {
      trackEvent('christmas_game_won')
    } else if (gameStatus === 'lost') {
      trackEvent('christmas_game_lost')
    }
  }, [gameStatus])
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-2xl font-bold mb-2">
        {gameStatus === 'playing' && '🎄 Finn alle julebombene! 🎄'}
        {gameStatus === 'won' && '🎅 Ho-Ho-Ho! Du vant! 🎅'}
        {gameStatus === 'lost' && '💥 Åh nei! Du tråkket på en julebombe! 💥'}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            onReset()
            trackEvent('christmas_game_reset')
          }}
          variant="default"
        >
          Start nytt spill
        </Button>
        <Button
          onClick={() => {
            onSantaHelper()
            trackEvent('christmas_game_powerup_used')
          }}
          disabled={!santaHelperAvailable || gameStatus !== 'playing'}
          variant="secondary"
        >
          Julehjelp {santaHelperAvailable ? '🎁' : '❌'}
        </Button>
      </div>
    </div>
  )
}
