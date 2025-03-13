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
const cyclePhase = (phases: typeof PHASES, idx: number) => {
  if (idx === 4) return phases[0]

  return phases[idx + 1]
}

export const useGameStore = create((set) => ({
  running: false,
  playerCount: 0,
  playerTurn: null,
  phases: ['opening', 'placing', 'betting', 'flipping'],
  phaseIdx: 0,
  advancePhase: () => set((state) => cyclePhase(state.phases, state.phaseIdx)),
}))
