import { useGameStateStore } from '../store'
import { getMaximumBet } from '../store/utils'
import { handleComputerTurns } from '../store/utils/ai'
import { Phase, Player } from '../types'

export const usePlayerInput = () => {
  const phase = useGameStateStore.use.phase()
  const placeCard = useGameStateStore.use.placeCard()
  const players = useGameStateStore.use.players()
  const changeToPhase = useGameStateStore.use.changeToPhase()
  const passTurn = useGameStateStore.use.passTurn()
  const passBet = useGameStateStore.use.passBet()
  const placeBet = useGameStateStore.use.placeBet()
  const deactivatePlayer = useGameStateStore.use.deactivatePlayer()
  const flipCard = useGameStateStore.use.flipCard()
  const setPlayerTurn = useGameStateStore.use.setPlayerTurn()
  const playerHasFlippedOwnCards =
    useGameStateStore.use.playerHasFlippedOwnCards()

  const canSelectCard = (player: Player) =>
    (phase === 'opening' && !player.ready) ||
    (phase === 'placing' && player.id === 1)

  const handlePlaceCard = (player: Player, card: 0 | 1) => {
    if (!canSelectCard(player)) return

    if (phase === 'opening') {
      placeCard(1, card)
      handleComputerTurns()
    }

    if (phase === 'placing') {
      placeCard(1, card)
      passTurn()
      handleComputerTurns()
    }
  }

  const handleFlipCard = (playerMatId: number, card: 0 | 1) => {
    flipCard(card, playerMatId)

    if (card === 0) {
      return changeToPhase('discarding')
    }
  }

  const handlePlaceBet = (bet: number) => {
    placeBet(1, bet)

    if (bet < getMaximumBet()) {
      passTurn()
      handleComputerTurns()
      return
    }

    changeToPhase('flipping')
  }

  const handlePassBet = () => {
    passBet(1)
    deactivatePlayer(players[1])
    passTurn()
    handleComputerTurns()
  }

  const handleChangePhase = (p: Phase) => changeToPhase(p)

  return {
    phase,
    handlePlaceCard,
    handlePlaceBet,
    handlePassBet,
    handleFlipCard,
    handleChangePhase,
    deactivatePlayer,
    canSelectCard,
    setPlayerTurn,
    playerHasFlippedOwnCards,
  }
}
