import { useGameStore, Player } from '../../stores/useGameStore'
import './styles.scss'

export const GameBoard = () => {
  const players = useGameStore((state) => state.players)

  return (
    <div className="game-board">
      <div className="table"></div>
      <PlayerArea player={players[1]} />
      <PlayerArea player={players[2]} />
      <PlayerArea player={players[3]} />
      <PlayerArea player={players[4]} />
    </div>
  )
}

const PlayerArea = ({ player }: { player: Player }) => {
  return (
    <div className={`player player-${player.id}`}>
        {player.name}
        <div className="hand">
          {player.hand.map((card) => (
            <span className="card">{card}</span>
          ))}
        </div>
      </div>
  )
}
