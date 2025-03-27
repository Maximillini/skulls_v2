import { StateCreator } from 'zustand';
import { allPlayersPlacedOne, allPlayersReady, stubPlayers } from './utils';
import { Phase, GameSlice, GameState } from '../types'

const PHASES: Phase[] = ['opening', 'placing', 'betting', 'flipping', 'discarding']

export const createGameSlice: StateCreator<GameState, [['zustand/devtools', never]], [], GameSlice> = (set, get) => ({
  isGameRunning: false,
  phases: PHASES,
  phaseIdx: 0,
  phase: PHASES[0] as Phase,
  currentHighBet: 0,
  flippedCards: 0,

  startGame: () => set(() => ({ isGameRunning: true })),
  changeToPhase: (phase) => set({ phase }, undefined, 'game/changeToPhase'),
  startNextPhase: (options?: { playerHitSkull: boolean }) => {
    const { phase, changeToPhase, players, resetAllPlayersStatus, playerTurn, handleComputerTurns } = get()

    if (phase === 'opening' && allPlayersReady(players) && allPlayersPlacedOne(players)) {
      changeToPhase('placing')
    }

    if (phase === 'placing') {
      changeToPhase('betting')
    }

    if (phase === 'betting') {
      changeToPhase('flipping')
    }

    if (phase === 'flipping') {
      if (options?.playerHitSkull) {
        resetAllPlayersStatus('hand', stubPlayers[1].hand)
        resetAllPlayersStatus('playedCards', [])
        changeToPhase('discarding')
      } else {
        changeToPhase('opening')
      }
    }

    resetAllPlayersStatus('ready', false)
    playerTurn.isComputer && handleComputerTurns()
  }
})
