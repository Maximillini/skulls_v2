import { usePlayer } from '../../hooks/usePlayer'
import { PlayedCardStack } from '../PlayerCard/PlayedCardStack'

export const PlayerMat = ({ playerId }: { playerId: number }) => {
  const { player } = usePlayer(playerId)

  return (
    <div className={`player-mat-area player-${playerId}-mat`}>
      <div className="player-mat">
        <PlayedCardStack cards={player.playedCards} playerMat={player} />
      </div>
    </div>
  )
}
