import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { BasePlayerArea } from '.'
import { useGameStateStore } from '../../store'
import { usePlayer } from '../../hooks/usePlayer'
import { usePlayerInput } from '../../hooks/usePlayerInput'
import { usePhase } from '../../hooks/usePhase'
import { getMaximumBet } from '../../store/utils'
import { Card } from '../../types'
import { Modal } from '../shared/Modal'

export const HumanPlayerArea = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentHighBet = useGameStateStore.use.currentHighBet()
  const {
    handlePlaceCard,
    handlePassBet,
    handleChangePhase,
    handleSelfDiscard,
    hitOwnSkull,
  } = usePlayerInput()
  const { player, isPlayerTurn } = usePlayer(1)
  const { isPhase } = usePhase()

  const userActionButtons = useMemo(() => {
    const handleClickPlaceBet = () => {
      if (isPhase('placing') && isPlayerTurn) {
        setIsMenuOpen(true)
        handleChangePhase('betting')
      }
    }

    return (
      <>
        {(isPhase('placing') ||
          (isPhase('betting') && currentHighBet !== getMaximumBet())) && (
          <button
            className="action-button"
            onClick={handleClickPlaceBet}
            disabled={!isPlayerTurn}
          >
            Bet
          </button>
        )}

        {isPhase('betting') && (
          <button className="action-button" onClick={() => handlePassBet()}>
            Pass
          </button>
        )}
      </>
    )
  }, [isPhase, handlePassBet, isPlayerTurn, handleChangePhase, currentHighBet])

  const getCardClickHandler = useCallback(
    (card: Card, idx: number) => {
      if (isPhase('opening') || isPhase('placing'))
        return handlePlaceCard(player, card)

      if (isPhase('discarding') && hitOwnSkull) return handleSelfDiscard(idx)

      return null
    },
    [isPhase, handlePlaceCard, handleSelfDiscard, player, hitOwnSkull]
  )

  const handleCloseModal = () => {
    setIsMenuOpen(false)
    if (currentHighBet === 0) handleChangePhase('placing')
  }

  return (
    <>
      <Modal
        isOpen={isMenuOpen && isPhase('betting') && isPlayerTurn}
        onClose={handleCloseModal}
      >
        <UserBetMenu currentHighBet={currentHighBet} />
      </Modal>
      <BasePlayerArea
        player={player}
        isCurrentTurn={isPlayerTurn}
        onCardClick={(card, idx) => getCardClickHandler(card, idx)}
        canSelectCard={
          isPhase('opening') ||
          isPhase('placing') ||
          (isPhase('discarding') && hitOwnSkull)
        }
      >
        {userActionButtons}
      </BasePlayerArea>
    </>
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
    <div className="user-bet-menu-container">
      <div className="user-bet-menu">
        <div>
          <button
            onClick={() => handleAdjustBet('-')}
            disabled={bet === currentHighBet + 1}
          >
            {'<'}
          </button>
          <span className="bet-amount">Bet: {bet}</span>
          <button
            onClick={() => handleAdjustBet('+')}
            disabled={bet === getMaximumBet()}
          >
            {'>'}
          </button>
        </div>
        <button className="submit-bet" onClick={() => handlePlaceBet(bet)}>
          Place Bet!
        </button>
      </div>
    </div>
  )
}
