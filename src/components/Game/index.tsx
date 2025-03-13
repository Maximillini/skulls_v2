import { useState } from 'react'

const game = {
  running: false,
  playerCount: 0,
  playerTurn: null,
  winner: null,
}

export const Game = () => {
  const [gameState, setGameState] = useState(game)

  return (
    <>Hi</>
  )
}
