import { useShallow } from 'zustand/shallow'
import { useGameStateStore } from '../store'

export const usePlayer = (playerId: number) => {
  const playerTurnId = useGameStateStore.use.playerTurn().id
  const player = useGameStateStore(
    useShallow((state) => state.players[playerId])
  )
  const playedCards = player.playedCards

  const isPlayerTurn = playerId === playerTurnId

  return { player, isPlayerTurn, playedCards }
}
