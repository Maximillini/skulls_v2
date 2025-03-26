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
  const { phase, placeCard, passBet, playerTurn, handleComputerTurns, passTurn, changeToPhase } = usePlayerAreaActions()

  const canSelectCard = () => (
    (phase === 'opening' && !player.ready) ||
    (phase === 'placing' && playerTurn.id === 1)
  )

  const handlePlaceCard = (card: 0 | 1) => {
    if (!canSelectCard()) return
    if(phase === 'opening') {
      placeCard(1, card)
      handleComputerTurns()
    }

    if (phase === 'placing') {
      placeCard(1, card)
      passTurn()
      handleComputerTurns()
    }
  }

  const handlePassBet = () => {
    passBet(1)
    passTurn()
    handleComputerTurns()
  }

  /**
   * Function to determine if cards should be displayed or hidden, depending on the player
   * 
   * @param card 0 or 1 with 1 representing flowers and 0 representing a skull, used only for user player
   * @param idx index of the card in player's hand, used to create a more unique key
   * @returns <span> tag that either shows the card face with value or card back without value
   */
  const cardOrientation = (card: 0 | 1, idx: number) => (
    player.id === 1 ? 
    <span className="card face-up" onClick={() => handlePlaceCard(card)} key={`${player.name}${idx}`}>{card === 1 ? '🌸' : '💀'}</span> :
    <span className="card face-down" key={`${player.name}${idx}`}></span>
  )

  const userActionButtons = () => (
    <>
      {phase === 'placing' && player.id === 1 && <button onClick={() => changeToPhase('betting')} disabled={playerTurn.id !== 1}>Place Bet</button>}
      {phase === 'betting' && player.id === 1 && <button onClick={handlePassBet}>Pass</button>}
    </>
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
        {userActionButtons()}
      </div>
      <div className="hand">
        {player.hand.map(cardOrientation)}
      </div>
      <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
      <div className="play-mat card">{player.playedCards}</div>
    </div>
  )
}
