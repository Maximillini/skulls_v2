import {
  allPlayersPlacedOne,
  allPlayersReady,
  getRandomCard,
  getRandomCardIndex,
} from '.'
import { useGameStateStore } from '../index'

export const handleComputerTurns = () => {
  const {
    players,
    phase,
    placeCard,
    playerTurn,
    passTurn,
    startNextPhase,
    currentHighBet,
    placeBet,
    discardCard: computerDiscard,
  } = useGameStateStore.getState()

  if (!playerTurn?.isComputer && phase === 'placing') return

  if (phase === 'opening') {
    if (!allPlayersPlacedOne(players)) {
      const computerPlayer = Object.values(players).find(
        (player) => player.isComputer && !player.ready
      )

      if (computerPlayer === undefined) return

      if (computerPlayer?.playedCards.length !== 1) {
        setTimeout(() => {
          placeCard(computerPlayer?.id || 2, getRandomCard(computerPlayer))
          handleComputerTurns()
        }, Math.random() * 1200)
      }
    }

    if (allPlayersReady(players) && allPlayersPlacedOne(players)) {
      return startNextPhase()
    }
  }

  if (phase === 'placing') {
    const computerPlayer = playerTurn
    if (!computerPlayer) return

    if (computerPlayer.hand.length === 0) return startNextPhase()

    setTimeout(() => {
      placeCard(computerPlayer.id, getRandomCard(computerPlayer))
      passTurn()
      handleComputerTurns()
    }, Math.random() * 2600)
  }

  if (phase === 'betting') {
    const computerPlayer = playerTurn
    const maxBet = Object.values(players).reduce(
      (acc, player) => player.playedCards.length + acc,
      0
    )

    if (currentHighBet === maxBet) return startNextPhase()

    setTimeout(() => {
      placeBet(computerPlayer.id, currentHighBet + 1)
      passTurn()
      handleComputerTurns()
    }, Math.random() * 2000)
  }

  if (phase === 'flipping') {
    startNextPhase()
  }

  if (phase === 'discarding') {
    setTimeout(() => {
      computerDiscard(playerTurn, getRandomCardIndex(playerTurn))
      startNextPhase()
    }, 1000)
  }
}
