import { StateCreator } from 'zustand';
import { allPlayersPlacedOne, allPlayersReady } from './utils';
import { Phase, GameSlice, GameState } from '../types'

const PHASES: Phase[] = ['opening', 'placing', 'betting', 'flipping', 'discarding']

export const createGameSlice: StateCreator<GameState, [], [], GameSlice> = (set, get) => ({
  isGameRunning: false,
  phases: PHASES,
  phaseIdx: 0,
  phase: PHASES[0] as Phase,

  startGame: () => set(() => ({ isGameRunning: true })),
  changeToPhase: (phase) => set({ phase }),
  startNextPhase: () => {
    const { phase, changeToPhase, players, resetPlayerReadyStatus, playerTurn, handleComputerTurns } = get()
    console.log(allPlayersReady(players))
    if (phase === 'opening' && allPlayersReady(players) && allPlayersPlacedOne(players)) {
      changeToPhase('placing')
      resetPlayerReadyStatus()
      if (playerTurn.isComputer) handleComputerTurns()
    }

    if (phase === 'placing') {
      changeToPhase('betting')
      resetPlayerReadyStatus()
    }
  }
})
