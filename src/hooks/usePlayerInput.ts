import { useGameStateStore } from '../store'
import {
  getMaximumBet,
  topUnflippedIndex,
  hasFlippedAllOwnCards,
  isCardFlipped,
  sleep,
} from '../store/utils'
import { handleComputerTurns } from '../store/utils/ai'
import { Phase, Player, Cards, Card } from '../types'

const HUMAN_PLAYER = 1

export const usePlayerInput = () => {
  const phase = useGameStateStore.use.phase()
  const startNextPhase = useGameStateStore.use.startNextPhase()
  const placeCard = useGameStateStore.use.placeCard()
  const players = useGameStateStore.use.players()
  const playerTurn = useGameStateStore.use.playerTurn()
  const changeToPhase = useGameStateStore.use.changeToPhase()
  const passTurn = useGameStateStore.use.passTurn()
  const passBet = useGameStateStore.use.passBet()
  const placeBet = useGameStateStore.use.placeBet()
  const deactivatePlayer = useGameStateStore.use.deactivatePlayer()
  const flipCard = useGameStateStore.use.flipCard()
  const setPlayerTurn = useGameStateStore.use.setPlayerTurn()
  const flippedCards = useGameStateStore.use.flippedCards()
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const setPlayerState = useGameStateStore.use.setPlayerState()
  const discardCard = useGameStateStore.use.discardCard()

  const canSelectCard = (player: Player) =>
    (phase === 'opening' && !player.ready && player.playedCards.length < 1) ||
    (phase === 'placing' && playerTurn.id === player.id)

  const handlePlaceCard = (player: Player, card: 0 | 1) => {
    if (!canSelectCard(player)) return

    if (phase === 'opening') {
      placeCard(HUMAN_PLAYER, card)
      handleComputerTurns()
    }

    if (phase === 'placing') {
      placeCard(HUMAN_PLAYER, card)
      passTurn()
      handleComputerTurns()
    }
  }

  const isFlippable = (
    playerMat: Player,
    flippingPlayer: Player,
    idx: number,
    cards: Cards
  ) => {
    if (phase !== 'flipping') return false

    const topIdx = topUnflippedIndex(playerMat.id, cards, flippedCards)
    const isTopCard = idx === topIdx
    const isOwnMat = flippingPlayer.id === playerMat.id
    const cardIsFlipped = isCardFlipped(playerMat.id, idx, flippedCards)
    const flippedAllOwn = hasFlippedAllOwnCards(flippingPlayer, flippedCards)

    if (flippedAllOwn) return isTopCard && !cardIsFlipped
    return isOwnMat && isTopCard && !cardIsFlipped
  }

  const handleFlipCard = (playerMatId: number, idx: number, card: Card) => {
    flipCard(playerMatId, idx)

    if (card === 0) {
      if (playerMatId === HUMAN_PLAYER) {
        sleep(() =>
          startNextPhase({ playerHitSkull: true, playerId: HUMAN_PLAYER })
        )
        return
      }

      sleep(() => startNextPhase({ playerHitSkull: true }))
      return
    }

    if (flippedCards.length === currentHighBet - 1) {
      if (playerTurn.hasWonChallenge) {
        console.log(`${playerTurn.name} Wins!`)
      }

      return sleep(() => {
        setPlayerState(playerTurn.id, 'hasWonChallenge', true)
        startNextPhase()
      })
    }
  }

  const handlePlaceBet = (bet: number) => {
    placeBet(HUMAN_PLAYER, bet)

    if (bet < getMaximumBet()) {
      passTurn()
      handleComputerTurns()
      return
    }

    changeToPhase('flipping')
  }

  const handlePassBet = () => {
    passBet(HUMAN_PLAYER)
    deactivatePlayer(players[HUMAN_PLAYER])
    passTurn()
    handleComputerTurns()
  }

  const handleChangePhase = (p: Phase) => changeToPhase(p)

  const handleSelfDiscard = (cardIdx: number) => {
    discardCard(players[HUMAN_PLAYER], cardIdx)
    startNextPhase()
  }

  return {
    phase,
    handlePlaceCard,
    handlePlaceBet,
    handlePassBet,
    handleFlipCard,
    handleChangePhase,
    handleSelfDiscard,
    deactivatePlayer,
    canSelectCard,
    setPlayerTurn,
    isFlippable,
  }
}
