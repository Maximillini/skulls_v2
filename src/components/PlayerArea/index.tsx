import React, { useRef, useEffect } from 'react'
import { PlayerCard } from '../PlayerCard'
import { Card, Player } from '../../types'
import { usePlayer } from '../../hooks/usePlayer'

type BasePlayerAreaProps = {
  player: Player
  isCurrentTurn: boolean
  canSelectCard?: boolean
  onCardClick?: (card: Card) => void
  children?: React.ReactNode
}

export const BasePlayerArea = ({
  player,
  isCurrentTurn,
  canSelectCard,
  onCardClick,
  children,
}: BasePlayerAreaProps) => {
  useEffect(() => {
    console.log(`Player ${player.id} rendered:`, renders.current)
  }, [player])

  const renders = useRef(0)

  renders.current = renders.current + 1

  return (
    <div
      className={`player player-${player.id} ${
        canSelectCard ? 'idle' : 'ready'
      } ${isCurrentTurn ? 'current' : ''}`}
    >
      <div>renders: {renders.current}</div>
      <div className="player-name-area">
        {player.name}
        <br />
        {children}
      </div>
      <div className="hand">
        {player.hand.map((card, i) => (
          <PlayerCard
            card={card}
            idx={i}
            key={i}
            handleClick={onCardClick ? () => onCardClick(card) : undefined}
            faceUp={player.id === 1}
          />
        ))}
      </div>
      <div className="discard">
        {player.discarded.map((card, i) => (
          <PlayerCard card={card} idx={i} key={i} faceUp={player.id === 1} />
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
