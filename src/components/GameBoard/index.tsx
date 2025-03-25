import { useRef } from 'react'
import { Player } from '../../types'
import { useGameStateStore } from '../../store'
import { usePlayerAreaActions } from '../../hooks/usePlayerAreaActions'
import './styles.scss'

export const GameBoard = () => {
  const renders = useRef(0)
  const players = useGameStateStore.use.players()

  renders.current = renders.current + 1

  return (
    <div className="game-board">
      <div>GameBoard renders: {renders.current}</div>
      <div className="table"></div>
      <PlayerArea player={players[1]} />
      <PlayerArea player={players[2]} />
      <PlayerArea player={players[3]} />
      <PlayerArea player={players[4]} />
    </div>
  )
}

const PlayerArea = ({ player }: { player: Player }) => {
  const renders = useRef(0)
  const { phase, placeCard, playerTurn, handleComputerTurns, passTurn, changeToPhase } = usePlayerAreaActions()

  const canSelectCard = () => (
    (phase === 'opening' && !player.ready) ||
    (phase === 'placing' && playerTurn.id === 1)
  )

  const handlePlaceCard = (card: 0 | 1) => {
    if(canSelectCard()) {
      placeCard(1, card)
      handleComputerTurns()
    }
  }

  const cardOrientation = (card: 0 | 1) => (
    player.id === 1 ? 
    <span className="card face-up" onClick={() => handlePlaceCard(card)}>{card === 1 ? '🌸' : '💀'}</span> :
    <span className="card face-down"></span>
  )

  renders.current = renders.current + 1

  return (
    <div className={`player player-${player.id} ${canSelectCard() ? 'idle' : 'ready'} ${playerTurn.id === player.id ? 'current' : ''}`}>
      <div>renders: {renders.current}</div>
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
