import { useGameStateStore } from '../../store'
import { getMaximumBet } from '../../store/utils'
import { GameBoard } from '../GameBoard'

export const Game = () => {
  const phase = useGameStateStore.use.phase()
  const playerTurn = useGameStateStore.use.playerTurn()
  const currentHighBet = useGameStateStore.use.currentHighBet()
  // phase progression:
  // opening - have all players placed a card? y - move to next phase
  // placing - player turn matters here - if player places card move to next player - if player bets, move to next phase
  // betting - player turn matters here - players raise bet until all players pass except one
  // flipping - only player taking challenge - if player succeeds, move to next phase unless player wins game, if fails remove card and move to next phase

  return (
    <>
      Game Board
      <br />
      {phase !== 'opening' && `Current Turn: ${playerTurn.name}`}
      <br />
      {phase === 'betting' && `Current Bet: ${currentHighBet} Cards on the table: ${getMaximumBet()}`}
      <br />
      Phase: {`${phase.toUpperCase()}`}
      <GameBoard />
    </>
  )
}
