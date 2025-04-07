import { usePlayer } from '../../hooks/usePlayer'
import { CardStack } from '../PlayerCard/CardStack'

export const PlayerMat = ({ playerId }: { playerId: number }) => {
  const { player } = usePlayer(playerId)

  return (
    <div className={`player-mat-area player-${playerId}-mat`}>
      <div className="player-mat">
        <CardStack cards={player.playedCards} playerMat={player} />
      </div>
    </div>
  )
}
