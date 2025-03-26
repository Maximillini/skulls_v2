import { StateCreator } from 'zustand';
import { allPlayersPlacedOne, allPlayersReady } from './utils';
import { Phase, GameSlice, GameState } from '../types'

const PHASES: Phase[] = ['opening', 'placing', 'betting', 'flipping', 'discarding']

export const createGameSlice: StateCreator<GameState, [], [], GameSlice> = (set, get) => ({
  isGameRunning: false,
  phases: PHASES,
  phaseIdx: 0,
  phase: PHASES[0] as Phase,
  currentHighBet: 0,

  startGame: () => set(() => ({ isGameRunning: true })),
  changeToPhase: (phase) => set({ phase }),
  startNextPhase: () => {
    const { phase, changeToPhase, players, resetAllPlayersStatus, playerTurn, handleComputerTurns } = get()

    if (phase === 'opening' && allPlayersReady(players) && allPlayersPlacedOne(players)) {
      changeToPhase('placing')
      resetAllPlayersStatus('ready', false)
      playerTurn.isComputer && handleComputerTurns()
    }

    if (phase === 'placing') {
      changeToPhase('betting')
      resetAllPlayersStatus('ready', false)
      playerTurn.isComputer && handleComputerTurns()
    }

    if (phase === 'betting') {
      changeToPhase('flipping')
      resetAllPlayersStatus('ready', false)
    }
  }
})
