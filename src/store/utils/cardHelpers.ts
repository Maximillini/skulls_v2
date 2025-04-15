import { Card, Cards, FlippedCard, Player } from '../../types'

export const getRandomCard = (player: Player) =>
  player.hand[Math.floor(Math.random() * player.hand.length)]

export const getRandomCardIndex = (player: Player) =>
  Math.floor(Math.random() * player.hand.length)

export const cardValue = (card: Card) => (card === 1 ? '🌸' : '💀')

export const removeTopCard = (cards: Cards) => {
  const cardStackCopy = [...cards]

  cardStackCopy.pop()

  return cardStackCopy
}

export const isCardFlipped = (
  playerId: number,
  idx: number,
  flippedCards: FlippedCard[]
) => flippedCards.some((fc) => fc.playerId === playerId && fc.index === idx)

export const topUnflippedIndex = (
  playerId: number,
  cards: Cards,
  flippedCards: FlippedCard[]
) =>
  [...cards]
    .map((_, i) => i)
    .reverse()
    .find((i) => !isCardFlipped(playerId, i, flippedCards))
