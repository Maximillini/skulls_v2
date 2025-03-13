import { useEffect, useState } from 'react'

const PHASES = ['opening', 'placing', 'betting', 'flipping']

const game = {
  running: false,
  playerCount: 0,
  playerTurn: null,
  winner: null,
  phase: PHASES[0]
}

export const Game = () => {
  const [gameState, setGameState] = useState(game)

  useEffect(() => {}, [gameState.winner])

  const resetGame = () => setGameState(game)

  // phase progression:
  // opening - have all players placed a card? y - move to next phase
  // placing - player turn matters here - if player places card move to next player - if player bets, move to next phase
  // betting - player turn matters here - players raise bet until all players pass except one
  // flipping - only player taking challenge - if player succeeds, move to next phase unless player wins game, if fails remove card and move to next phase

  return (
    <>{gameState.playerCount}</>
  )
}
