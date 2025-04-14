import { usePhase } from '../../hooks/usePhase'
import { useGameStateStore } from '../../store'
import { getMaximumBet } from '../../store/utils'
import { GameBoard } from '../GameBoard'

export const Game = () => {
  const { phase, isPhase } = usePhase()
  const playerTurn = useGameStateStore.use.playerTurn()
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const flippedCards = useGameStateStore.use.flippedCards()

  return (
    <>
      {!isPhase('opening') && `Current Turn: ${playerTurn.name}`}
      <br />
      {isPhase('flipping') &&
        `Flips Remaining: ${currentHighBet - flippedCards.length}`}
      {isPhase('betting') &&
        `Current Bet: ${currentHighBet} Cards on the table: ${getMaximumBet()}`}
      <br />
      Phase: {`${phase.toUpperCase()}`}
      <GameBoard />
    </>
  )
}
