import { StateCreator } from 'zustand';
import { allPlayersReady } from './utils';
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
    const { phase, changeToPhase, players, resetPlayerReadyStatus } = get()
    
    if (phase === 'opening' && allPlayersReady(players)) {
      changeToPhase('placing')
      resetPlayerReadyStatus()
    }
  }
})
