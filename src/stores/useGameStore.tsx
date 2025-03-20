import { create } from 'zustand'

const PHASES = ['opening', 'placing', 'betting', 'flipping']

export type Player = {
  id: number,
  name: string,
  hand: number[],
  playedCards: number[]
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
  name: 'Player-1',
  hand: [1, 1, 1, 0],
  playedCards: [],
  discarded: [],
  challengesWon: 0
}

const stubPlayers = {
  1: fakePlayer,
  2: {...fakePlayer, id: 2, name: 'Player-2'},
  3: {...fakePlayer, id: 3, name: 'Player-3'},
  4: {...fakePlayer, id: 4, name: 'Player-4'},
}

export const useGameStore = create<GameState>((set, get) => ({
  running: false,
  players: stubPlayers,
  playerCount: () => Object.values(get().players).length,
  playerTurn: () => Object.values(get().players)[0],
  phases: PHASES,
  phaseIdx: 0,
  advancePhase: () => set((state) => ({phaseIdx: state.phaseIdx === 3 ? 0 : state.phaseIdx + 1})),
  startGame: () => set(() => ({ running: true })),
  addPlayer: (player) => set((state) => ({ players: { ...state.players, [player.id]: player }}))
}))
