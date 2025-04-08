import { useRef } from 'react'
import { ComputerPlayerArea } from '../PlayerArea'
import { HumanPlayerArea } from '../PlayerArea/HumanPlayerArea'
import { PlayerMat } from './PlayerMat'
import { useGameStateStore } from '../../store'
import './styles.scss'
import { PlayerCard } from '../PlayerCard'
import { useShallow } from 'zustand/shallow'

export const GameBoard = () => {
  const renders = useRef(0)
  const flippedCards = useGameStateStore(
    useShallow((state) => state.flippedCards)
  )

  return (
    <div className="game-board">
      <div>GameBoard renders: {renders.current}</div>
      <div className="table">
        <div className="player-flip-area">
          {flippedCards.map((fc, idx) => (
            <PlayerCard card={fc} idx={idx} faceUp={true} key={idx} />
          ))}
        </div>
        <PlayerMat playerId={1} />
        <PlayerMat playerId={2} />
        <PlayerMat playerId={3} />
        <PlayerMat playerId={4} />
      </div>
      <HumanPlayerArea playerId={1} />
      <ComputerPlayerArea playerId={2} />
      <ComputerPlayerArea playerId={3} />
      <ComputerPlayerArea playerId={4} />
    </div>
  )
}
