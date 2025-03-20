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

const PlayerHand = ({ hand, isVisible }: { hand: Player['hand'], isVisible: boolean }) => {
  return (
    <div className="hand">
      {hand.map((card) => (
        <span className={`card ${isVisible ? 'face-up' : 'face-down'}`}>{isVisible ? card : null}</span>
      ))}
    </div>
  )
}

const PlayerArea = ({ player }: { player: Player }) => {
  return (
    <div className={`player player-${player.id}`}>
        <div className="player-name-area">
          {player.name}
        </div>
        <PlayerHand hand={player.hand} isVisible={player.id === 1 ? true : false}/>
        <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
      </div>
  )
}
