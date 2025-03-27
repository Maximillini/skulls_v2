import { useState, useRef, useEffect } from 'react'
import { Player, Phase } from '../../types'
import { useGameStateStore } from '../../store'
import { usePlayerAreaActions } from '../../hooks/usePlayerAreaActions'
import { getMaximumBet } from '../../store/utils'
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
  const [isUserBetting, setIsUserBetting] = useState(false)
  const renders = useRef(0)
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const { phase, placeCard, deactivatePlayer, passBet, playerTurn, handleComputerTurns, passTurn, changeToPhase } = usePlayerAreaActions()

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
    deactivatePlayer(player)
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
        {player.id === 1 && <UserBetMenu
          phase={phase}
          player={player}
          playerTurn={playerTurn}
          currentHighBet={currentHighBet}
        />}
      </div>
      <div className="hand">
        {player.hand.map(cardOrientation)}
      </div>
      <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
      <div className="play-mat card">{player.playedCards}</div>
    </div>
  )
}

type UserBetMenuProps = {
  phase: Phase,
  player: Player,
  playerTurn: Player,
  currentHighBet: number
}

const UserBetMenu = ({ phase, player, playerTurn, currentHighBet }: UserBetMenuProps) => {
  const [bet, setBet] = useState(currentHighBet + 1)
  const { placeBet, passTurn, changeToPhase, handleComputerTurns } = usePlayerAreaActions()
  useEffect(() => {
    setBet(currentHighBet + 1)
  }, [currentHighBet])

  const handleAdjustBet = (operator: '+' | '-') => {
    if (operator === '+') return setBet((prev) => prev + 1)
    
    if (operator === '-') return setBet((prev) => prev - 1)
  }

  const handlePlaceBet = () => {
    placeBet(1, bet)

    if (bet < getMaximumBet()) {
      passTurn()
      handleComputerTurns()
    }
    if (bet === getMaximumBet()) changeToPhase('flipping')
  }

  return (
    <>
      {phase === 'betting' && playerTurn.id === 1 && (
        <div className="user-bet-menu">
          Bet: {bet}
          <input type="button" value="-" onClick={() => handleAdjustBet('-')} disabled={bet === currentHighBet + 1} />
          <input type="button" value="+" onClick={() => handleAdjustBet('+')} disabled={bet === getMaximumBet()} />
          <input type="button" value="Bet" onClick={handlePlaceBet} />
        </div>
      )}  
    </>
  )
}
