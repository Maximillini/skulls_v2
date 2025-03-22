import { Player } from '../../stores/useGameStore'
import { useGameStateStore } from '../../stores'
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
  const playerTurn = useGameStateStore.use.playerTurn()
  const changeToPhase = useGameStateStore.use.changeToPhase()

  console.log({playerTurn})

  const handlePlaceCard = (card: 0 | 1) => {
    if (phase === 'opening' && !player.ready) placeCard(player.id, card)
  }

  const cardOrientation = (card: 0 | 1) => (
    player.id === 1 ? 
    <span className="card face-up" onClick={() => handlePlaceCard(card)}>{card === 1 ? '🌸' : '💀'}</span> :
    <span className="card face-down"></span>
  )

  return (
    <div className={`player player-${player.id} ${player.ready ? 'ready' : 'idle'} ${playerTurn.id === player.id ? 'current' : ''}`}>
      <div className="player-name-area">
        {player.name}
        <br />
        {player.ready ? "Ready" : "Idle"}
        <br />
        {phase === 'placing' && player.id === 1 && <button onClick={() => changeToPhase('betting')} disabled={playerTurn.id !== 1}>Place Bet</button>}
      </div>
      <div className="hand">
        {player.hand.map(cardOrientation)}
      </div>
      <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
      <div className="play-mat card">{player.playedCards}</div>
    </div>
  )
}
