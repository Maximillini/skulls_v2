import { cardValue } from '../../store/utils'
import { Card } from '../../types'

type CardProps = {
  card: Card
  idx: number
  handleClick?: () => void
  isFlipped?: boolean
  isPlayed?: boolean
  canClick?: boolean
}

export const PlayerCard = ({
  card,
  idx,
  handleClick,
  isFlipped,
  isPlayed,
  canClick,
}: CardProps) => {
  return (
    <div
      className={`card ${isPlayed ? 'played-card' : ''} ${
        isFlipped ? 'face' : ''
      } ${canClick ? 'flippable' : ''}`}
      key={idx}
      onClick={handleClick}
    >
      {isFlipped ? (
        <span className={`${isFlipped ? 'face' : ''}`}>{cardValue(card)}</span>
      ) : (
        <span></span>
      )}
    </div>
  )
}
