import { create } from 'zustand'

/*
const game = {
  running: false,
  playerCount: 0,
  playerTurn: null,
  winner: null,
  phase: PHASES[0]
}
**/
const PHASES = ['opening', 'placing', 'betting', 'flipping']

type GameState = {
  running: boolean,
  players: [],
  playerCount: number,
  playerTurn: null,
  phases: typeof PHASES,
  phaseIdx: number,
  advancePhase: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  running: true,
  players: [],
  playerCount: get().players.length,
  playerTurn: get().players[0] || null,
  phases: PHASES,
  phaseIdx: 0,
  advancePhase: () => set((state) => ({phaseIdx: state.phaseIdx === 3 ? 0 : state.phaseIdx + 1})),
}))
