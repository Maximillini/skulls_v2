import { PlayerCard } from '.'
import { usePlayerInput } from '../../hooks/usePlayerInput'
import { useGameStateStore } from '../../store'
import { Card, Cards, FlippedCard, Player } from '../../types'

export const PlayedCardStack = ({
  cards,
  playerMat,
}: {
  cards: Cards
  playerMat: Player
}) => {
  const { handleFlipCard, isFlippable } = usePlayerInput()
  const playerTurn = useGameStateStore.use.playerTurn()
  const flippedCards = useGameStateStore.use.flippedCards()

  const handleFlip = (card: Card, idx: number) => {
    if (isFlippable(playerMat, playerTurn, idx, cards)) {
      handleFlipCard(playerMat.id, idx, card)
    }
  }

  return (
    <>
      {cards.map((card, idx) => {
        const isFlipped = flippedCards.some(
          (fc: FlippedCard) => fc.playerId === playerMat.id && fc.index === idx
        )

        return (
          <PlayerCard
            key={idx}
            card={card}
            isFlipped={isFlipped}
            isPlayed={true}
            idx={idx}
            handleClick={() => handleFlip(card, idx)}
            canClick={isFlippable(playerMat, playerTurn, idx, cards)}
          />
        )
      })}
    </>
  )
}
