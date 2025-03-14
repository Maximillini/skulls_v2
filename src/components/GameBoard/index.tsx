import { useGameStore } from '../../stores/useGameStore'
import './styles.scss'

export const GameBoard = () => {
  const players = useGameStore((state) => state.players)

  return (
    <div className="game-board">
      <div className="table"></div>
      <div className="player-1">{players[1].name}</div>
    </div>
  )
}
