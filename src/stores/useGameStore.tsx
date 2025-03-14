import { create } from 'zustand'

const PHASES = ['opening', 'placing', 'betting', 'flipping']

type Player = {
  id: number,
  name: string,
  hand: number[],
  discarded: string[],
  challengesWon: 0 | 1 | 2
}

type GameState = {
  running: boolean,
  players: Record<number, Player>,
  playerCount: () => number,
  playerTurn: () => Player,
  phases: typeof PHASES,
  phaseIdx: number,
  advancePhase: () => void,
  startGame: () => void,
  addPlayer: (player: Player) => void,
}

const fakePlayer: Player = {
  id: 1,
  name: 'Max',
  hand: [1, 1, 1, 0],
  discarded: [],
  challengesWon: 0
}

export const useGameStore = create<GameState>((set, get) => ({
  running: false,
  players: { [fakePlayer.id]: fakePlayer },
  playerCount: () => Object.values(get().players).length,
  playerTurn: () => Object.values(get().players)[0],
  phases: PHASES,
  phaseIdx: 0,
  advancePhase: () => set((state) => ({phaseIdx: state.phaseIdx === 3 ? 0 : state.phaseIdx + 1})),
  startGame: () => set(() => ({ running: true })),
  addPlayer: (player) => set((state) => ({ players: { ...state.players, [player.id]: player }}))
}))
