import { useRef } from 'react'
import { ComputerPlayerArea } from '../PlayerArea'
import { HumanPlayerArea } from '../PlayerArea/HumanPlayerArea'
import { PlayerMat } from './PlayerMat'
import './styles.scss'

export const GameBoard = () => {
  const renders = useRef(0)

  return (
    <div className="game-board">
      <div>GameBoard renders: {renders.current}</div>
      <div className="table">
        <div className="player-flip-area"></div>
        <PlayerMat playerId={1} />
        <PlayerMat playerId={2} />
        <PlayerMat playerId={3} />
        <PlayerMat playerId={4} />
      </div>
      <HumanPlayerArea />
      <ComputerPlayerArea playerId={2} />
      <ComputerPlayerArea playerId={3} />
      <ComputerPlayerArea playerId={4} />
    </div>
  )
}
