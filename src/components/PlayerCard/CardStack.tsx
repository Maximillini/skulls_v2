import { usePlayerInput } from '../../hooks/usePlayerInput'
import { useGameStateStore } from '../../store'
import { Card, Cards, Player } from '../../types'

export const CardStack = ({
  cards,
  playerMat,
}: {
  cards: Cards
  playerMat: Player
}) => {
  const { handleFlipCard, phase, playerHasFlippedOwnCards } = usePlayerInput()
  const playerTurn = useGameStateStore.use.playerTurn()

  const isFlippable = (
    playerMat: Player,
    player: Player,
    idx: number,
    cards: Cards
  ) => {
    if (phase !== 'flipping') return false

    const isTopCard = idx === cards.length - 1
    const isPlayersOwnMat = player.id === playerMat.id

    console.log({ playerMat, player, idx, cards })

    console.log({ isTopCard, isPlayersOwnMat })

    return (
      isTopCard && (isPlayersOwnMat || playerHasFlippedOwnCards(playerTurn.id))
    )
  }

  const handleFlip = (card: Card, idx: number) => {
    if (isFlippable(playerMat, playerTurn, idx, cards)) {
      handleFlipCard(playerMat.id, card)
    }
  }

  return (
    <>
      {cards.map((card, idx) => (
        <div
          className={`card played-card ${
            isFlippable(playerTurn, playerMat, idx, cards) ? 'flippable' : ''
          }`}
          onClick={() => handleFlip(card, idx)}
        ></div>
      ))}
    </>
  )
}
