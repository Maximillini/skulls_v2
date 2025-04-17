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

type PlayerNameAreaProps = {
  name: string
  isCurrentTurn: boolean
  children?: React.ReactNode
}

export const PlayerNameArea = React.memo(
  ({ name, children, isCurrentTurn }: PlayerNameAreaProps) => (
    <div className="player-name-area">
      <div className="avatar-container">
        <div className={`player-avatar ${isCurrentTurn ? 'current' : ''}`}>
          {isCurrentTurn ? '🙋‍♂️' : '🙍‍♂️'}
        </div>
      </div>
      <div className="player-name">{name}</div>
      <br />
      {children && <div className="player-actions-row">{children}</div>}
    </div>
  )
)

export const BasePlayerArea = React.memo(
  ({
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
        }`}
      >
        <PlayerNameArea name={player.name} isCurrentTurn={isCurrentTurn}>
          {children}
        </PlayerNameArea>
        <div className="hand">
          {player.hand.map((card, idx) => (
            <PlayerCard
              card={card}
              idx={idx}
              key={idx}
              handleClick={
                onCardClick ? () => onCardClick(card, idx) : undefined
              }
              isFlipped={player.id === 1}
            />
          ))}
        </div>
        <div className="discard-area">
          {player.discarded.length > 0 && <>Discard</>}
          <div className="discard">
            {player.discarded.map((card, i) => (
              <PlayerCard card={card} idx={i} key={i} isFlipped={false} />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export const ComputerPlayerArea = ({ playerId }: { playerId: number }) => {
  const { player, isPlayerTurn } = usePlayer(playerId)

  return <BasePlayerArea player={player} isCurrentTurn={isPlayerTurn} />
}
