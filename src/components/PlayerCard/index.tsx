import { cardValue } from '../../store/utils'
import { Card } from '../../types'

type CardProps = {
  card: Card
  idx: number
  handleClick?: () => void
  faceUp?: boolean
  key: number
}

export const PlayerCard = ({ card, idx, handleClick, faceUp }: CardProps) =>
  faceUp ? (
    <span className="card face-up" onClick={handleClick} key={idx}>
      {cardValue(card)}
    </span>
  ) : (
    <span className="card face-down" key={idx}></span>
  )
