import { StateCreator } from 'zustand'
import { allPlayersPlacedOne, allPlayersReady } from './utils'
import { Phase, GameSlice, GameState } from '../types'
import { handleComputerTurns } from './utils/ai'

const PHASES: Phase[] = [
  'opening',
  'placing',
  'betting',
  'flipping',
  'discarding',
]

export const createGameSlice: StateCreator<
  GameState,
  [['zustand/devtools', never]],
  [],
  GameSlice
> = (set, get) => ({
  isGameRunning: false,
  phases: PHASES,
  rounds: 0,
  phaseIdx: 0,
  phase: PHASES[0] as Phase,
  currentHighBet: 0,
  flippedCards: [],

  setGameState: (prop, value) => set((state) => ({ ...state, [prop]: value })),
  startGame: () => set(() => ({ isGameRunning: true })),
  changeToPhase: (phase) => set({ phase }, undefined, 'game/changeToPhase'),
  startNextPhase: (options) => {
    const {
      phase,
      changeToPhase,
      players,
      resetAllPlayersStatus,
      returnAllPlayedCards,
      setGameState,
    } = get()

    if (
      phase === 'opening' &&
      allPlayersReady(players) &&
      allPlayersPlacedOne(players)
    ) {
      changeToPhase('placing')
    }

    if (phase === 'placing') changeToPhase('betting')

    if (phase === 'betting') changeToPhase('flipping')

    if (phase === 'flipping') {
      returnAllPlayedCards()

      if (options?.playerHitSkull) {
        changeToPhase('discarding')
        if (options?.playerId === 1) return
      } else {
        changeToPhase('opening')
      }
    }

    setGameState('currentHighBet', 0)

    if (phase === 'discarding') {
      changeToPhase('opening')
    }

    setTimeout(() => {
      resetAllPlayersStatus('ready', false)
      handleComputerTurns()
    }, 0)
  },
})
