import { create } from 'zustand'
import { createGameSlice } from './gameSlice'
import { createPlayerSlice } from './playerSlice'
import { createTurnSlice } from './turnSlice'
import { createSelectors } from './utils'
import { GameState } from '../types'

const gameStore = create<GameState>((...a) => ({
  ...createGameSlice(...a),
  ...createPlayerSlice(...a),
  ...createTurnSlice(...a),
}))

export const useGameStateStore = createSelectors(gameStore)
