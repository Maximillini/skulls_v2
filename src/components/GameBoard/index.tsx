import { useGameStateStore, Player } from '../../stores/useGameStore'
import './styles.scss'

export const GameBoard = () => {
  const players = useGameStateStore.use.players()

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

// const PlayerHand = ({ hand, isVisible }: { hand: Player['hand'], isVisible: boolean }) => {
//   return (
//     <div className="hand">
//       {hand.map((card) => (
//         <span className={`card ${isVisible ? 'face-up' : 'face-down'}`}>{isVisible ? card : null}</span>
//       ))}
//     </div>
//   )
// }

const PlayerArea = ({ player }: { player: Player }) => {
  const phase = useGameStateStore.use.phase()
  const placeCard = useGameStateStore.use.placeCard()

  const handlePlaceCard = (card: 0 | 1) => {
    if (phase === 'opening' && !player.ready) placeCard(player.id, card)
  }

  const cardOrientation = (card: 0 | 1) => (
    player.id === 1 ? 
    <span className="card face-up" onClick={() => handlePlaceCard(card)}>{card === 1 ? '🌸' : '💀'}</span> :
    <span className="card face-down"></span>   
  )

  return (
    <div className={`player player-${player.id} ${player.ready ? 'ready' : 'idle'}`}>
        <div className="player-name-area">
          {player.name}
          <br />
          {player.ready ? "Ready" : "Idle"}
        </div>
        <div className="hand">
          {player.hand.map(cardOrientation)}
        </div>
        <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
      </div>
  )
}
