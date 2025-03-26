import { useGameStateStore } from '../store'

export const usePlayerAreaActions = () => {
  const phase = useGameStateStore.use.phase()
  const placeCard = useGameStateStore.use.placeCard()
  const playerTurn = useGameStateStore.use.playerTurn()
  const changeToPhase = useGameStateStore.use.changeToPhase()
  const handleComputerTurns = useGameStateStore.use.handleComputerTurns()
  const passTurn = useGameStateStore.use.passTurn()
  const passBet = useGameStateStore.use.passBet()
  const placeBet = useGameStateStore.use.placeBet()

  return {phase, placeCard, playerTurn, changeToPhase, handleComputerTurns, passTurn, placeBet, passBet}
}
