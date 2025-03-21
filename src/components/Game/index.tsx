import { useGameStateStore } from '../../stores/useGameStore'
import { GameBoard } from '../GameBoard'

export const Game = () => {
  const startGame = useGameStateStore.use.startGame()
  const isGameRunning = useGameStateStore.use.isGameRunning()
  const phase = useGameStateStore.use.phase()
  // phase progression:
  // opening - have all players placed a card? y - move to next phase
  // placing - player turn matters here - if player places card move to next player - if player bets, move to next phase
  // betting - player turn matters here - players raise bet until all players pass except one
  // flipping - only player taking challenge - if player succeeds, move to next phase unless player wins game, if fails remove card and move to next phase

  return (
    <>
      Game Board
      <br />
      {`${isGameRunning}`}
      <button onClick={startGame}>Start Game</button>
      <br />
      Phase: {`${phase.toUpperCase()}`}
      <GameBoard />
    </>
  )
}
