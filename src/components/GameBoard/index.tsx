import { useState, useRef, useEffect } from 'react'
import { Player, Phase } from '../../types'
import { useGameStateStore } from '../../store'
import { usePlayerAreaActions } from '../../hooks/usePlayerAreaActions'
import { cardValue, getMaximumBet } from '../../store/utils'
import './styles.scss'

export const GameBoard = () => {
  const renders = useRef(0)
  const players = useGameStateStore.use.players()
  const flippedCards = useGameStateStore.use.flippedCards()
  renders.current = renders.current + 1

  return (
    <div className="game-board">
      <div>GameBoard renders: {renders.current}</div>
      <div className="table">
        <div className="player-flip-area">
          {flippedCards.map((fc) => (
            <span className="card face-up">{cardValue(fc)}</span>
          ))}
        </div>
        <PlayerMat player={players[1]} />
        <PlayerMat player={players[2]} />
        <PlayerMat player={players[3]} />
        <PlayerMat player={players[4]} />
        </div>
      <PlayerArea player={players[1]} />
      <PlayerArea player={players[2]} />
      <PlayerArea player={players[3]} />
      <PlayerArea player={players[4]} />
    </div>
  )
}

type CardProps = {
  card: 1 | 0,
  idx: number,
  player: Player,
  handleClick: () => void
}

const Card = ({ card, idx, player, handleClick }: CardProps) => (
  player.id === 1 ? 
    <span className="card face-up" onClick={handleClick} key={`${player.name}${idx}`}>{cardValue(card)}</span> :
    <span className="card face-down" key={`${player.name}${idx}`}></span>
)

const CardStack = ({ cards, player }: { cards: (0 | 1)[], player: Player }) => {
  const playerTurn = useGameStateStore.use.playerTurn()
  const players = useGameStateStore.use.players()
  const phase = useGameStateStore.use.phase()
  const flipCard = useGameStateStore.use.flipCard()
  const changeToPhase = useGameStateStore.use.changeToPhase()
  const isPlayersOwnMat = player.id === playerTurn.id

  const isFlippable = (idx: number) => {
    const isTopCard = idx === (cards.length - 1)
    const isFlippingPhase = phase === 'flipping'
    
    return isTopCard && isFlippingPhase && (isPlayersOwnMat || players[playerTurn.id].flippedOwnCards)
  }

  const handleFlipCard = (idx: number) => {
    if (!isFlippable(idx)) return
    
    if (cards[idx] === 0) {
      debugger
      return changeToPhase('discarding')
    }

    console.log(cards[idx])
    flipCard(playerTurn.id, cards[idx], player.id)
  }

  return (
    <>
      {cards.map((_, idx) => (
        <div className={`card played-card ${isFlippable(idx) ? 'flippable': ''}`} onClick={() => handleFlipCard(idx)}></div>
      ))}
    </>
  )
}

const PlayerMat = ({ player }: { player: Player }) => (
  <div className={`player-mat-area player-${player.id}-mat`}>
    <div className="player-mat">
      <CardStack cards={player.playedCards} player={player} />
    </div>
  </div>
)


const PlayerArea = ({ player }: { player: Player }) => {
  // const renders = useRef(0)
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const flippedOwnCards = player.flippedOwnCards
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

  const userActionButtons = () => (
    <>
      {phase === 'placing' && player.id === 1 && <button onClick={() => changeToPhase('betting')} disabled={playerTurn.id !== 1}>Place Bet</button>}
      {phase === 'betting' && player.id === 1 && <button onClick={handlePassBet}>Pass</button>}
    </>
  )

  // renders.current = renders.current + 1

  return (
    <div className={`player player-${player.id} ${canSelectCard() ? 'idle' : 'ready'} ${playerTurn.id === player.id ? 'current' : ''}`}>
      {/* <div>renders: {renders.current}</div> */}
      { phase === 'flipping' && <span>{`${flippedOwnCards}`}</span>}
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
        {player.hand.map((card, i) => (
          <Card 
            player={player}
            card={card}
            idx={i}
            handleClick={() => handlePlaceCard(card)}
          />
        ))}
      </div>
      <div className="discard">{player.discarded.map(() => <div className="discarded-card"></div>)}</div>
    </div>
  )
}

type UserBetMenuProps = {
  phase: Phase,
  player: Player,
  playerTurn: Player,
  currentHighBet: number
}

const UserBetMenu = ({ phase, playerTurn, currentHighBet }: UserBetMenuProps) => {
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
      return
    }

    changeToPhase('flipping')
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
