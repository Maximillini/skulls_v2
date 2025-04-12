import React, { useMemo, useState, useEffect } from 'react'
import { BasePlayerArea } from '.'
import { useGameStateStore } from '../../store'
import { usePlayer } from '../../hooks/usePlayer'
import { usePlayerInput } from '../../hooks/usePlayerInput'
import { usePhase } from '../../hooks/usePhase'
import { getMaximumBet } from '../../store/utils'

export const HumanPlayerArea = React.memo(() => {
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const { handlePlaceCard, handlePassBet, handleChangePhase } = usePlayerInput()
  const { player, isPlayerTurn } = usePlayer(1)
  const { isPhase } = usePhase()

  const userActionButtons = useMemo(
    () => (
      <>
        {isPhase('placing') && (
          <button
            onClick={() => handleChangePhase('betting')}
            disabled={!isPlayerTurn()}
          >
            Place Bet
          </button>
        )}

        {isPhase('betting') && (
          <button onClick={() => handlePassBet()}>Pass</button>
        )}
      </>
    ),
    [isPhase, handlePassBet, handleChangePhase, isPlayerTurn]
  )

  return (
    <BasePlayerArea
      player={player}
      isCurrentTurn={isPlayerTurn()}
      onCardClick={(card) => handlePlaceCard(player, card)}
      canSelectCard={isPhase('opening') || isPhase('placing')}
    >
      {userActionButtons}
      {isPhase('betting') && isPlayerTurn() && (
        <UserBetMenu currentHighBet={currentHighBet} />
      )}
    </BasePlayerArea>
  )
})

const UserBetMenu = ({ currentHighBet }: { currentHighBet: number }) => {
  const [bet, setBet] = useState(currentHighBet + 1)
  const { handlePlaceBet } = usePlayerInput()

  useEffect(() => {
    setBet(currentHighBet + 1)
  }, [currentHighBet])

  const handleAdjustBet = (operator: '+' | '-') => {
    if (operator === '+') return setBet((prev) => prev + 1)

    if (operator === '-') return setBet((prev) => prev - 1)
  }

  return (
    <>
      <div className="user-bet-menu">
        Bet: {bet}
        <input
          type="button"
          value="-"
          onClick={() => handleAdjustBet('-')}
          disabled={bet === currentHighBet + 1}
        />
        <input
          type="button"
          value="+"
          onClick={() => handleAdjustBet('+')}
          disabled={bet === getMaximumBet()}
        />
        <input type="button" value="Bet" onClick={() => handlePlaceBet(bet)} />
      </div>
    </>
  )
}
