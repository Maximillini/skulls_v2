import React from 'react'
import { PlayerCard } from '../PlayerCard'
import { Card, Player } from '../../types'
import { usePlayer } from '../../hooks/usePlayer'

type BasePlayerAreaProps = {
  player: Player
  isCurrentTurn: boolean
  canSelectCard?: boolean
  onCardClick?: (card: Card, idx: number) => void
  children?: React.ReactNode
}

export const BasePlayerArea = ({
  player,
  isCurrentTurn,
  canSelectCard,
  onCardClick,
  children,
}: BasePlayerAreaProps) => {
  return (
    <div
      className={`player player-${player.id} ${
        canSelectCard ? 'idle' : 'ready'
      } ${isCurrentTurn ? 'current' : ''}`}
    >
      <div className="player-name-area">
        {player.name}
        <br />
        {children}
      </div>
      <div className="hand">
        {player.hand.map((card, idx) => (
          <PlayerCard
            card={card}
            idx={idx}
            key={idx}
            handleClick={onCardClick ? () => onCardClick(card, idx) : undefined}
            isFlipped={player.id === 1}
          />
        ))}
      </div>
      <div className="discard">
        {player.discarded.map((card, i) => (
          <PlayerCard card={card} idx={i} key={i} isFlipped={false} />
        ))}
      </div>
    </div>
  )
}

export const ComputerPlayerArea = React.memo(
  ({ playerId }: { playerId: number }) => {
    const { player, isPlayerTurn } = usePlayer(playerId)

    return <BasePlayerArea player={player} isCurrentTurn={isPlayerTurn()} />
  }
)
