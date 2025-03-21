import { create, StoreApi, UseBoundStore } from 'zustand'

const fakePlayer: Player = {
  id: 1,
  name: 'Player-1',
  hand: [1, 1, 1, 0],
  playedCards: [],
  discarded: [],
  challengesWon: 0,
  ready: false
}

const stubPlayers = {
  1: fakePlayer,
  2: {...fakePlayer, id: 2, name: 'Player-2', isComputer: true },
  3: {...fakePlayer, id: 3, name: 'Player-3', isComputer: true },
  4: {...fakePlayer, id: 4, name: 'Player-4', isComputer: true },
}

type Phase = 'opening' | 'placing' | 'betting' | 'flipping'
const PHASES: Phase[] = ['opening', 'placing', 'betting', 'flipping']

export type Player = {
  id: number,
  name: string,
  hand: (0 | 1 | null)[],
  playedCards: number[]
  discarded: string[],
  challengesWon: 0 | 1 | 2,
  // TODO - Think of more descriptive name than 'ready'
  ready: boolean,
  isComputer?: true
}

type GameState = {
  isGameRunning: boolean,
  players: Record<number, Player>,
  playerCount: () => number,
  playerTurn: () => Player,
  phases: typeof PHASES
  phaseIdx: number,
  phase: Phase,
  startNextPhase: () => void,
  placeCard: (playerId: number, card: 0 | 1) => void,
  handleComputerTurns: () => void,
  advancePhase: () => void,
  startGame: () => void,
  addPlayer: (player: Player) => void,
}

export const gameStore = create<GameState>((set, get) => ({
  isGameRunning: false,
  players: stubPlayers,
  playerCount: () => Object.values(get().players).length,
  playerTurn: () => Object.values(get().players)[0],
  phases: PHASES,
  phaseIdx: 0,
  phase: 'opening',
  startNextPhase: () => {
    const { phase, players, isGameRunning } = get()

    // if (!isGameRunning) return

    if (phase === 'opening') {
      const allPlaced = Object.values(players).every((p) => p.ready)

      console.log({ allPlaced })

      if (allPlaced) {
        set({ phase: 'placing' })
      }
    }

    console.log(get())
  },
  placeCard: (playerId: number, card: 0 | 1) => {
    if (get().players[playerId].ready) return
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          playedCards: [...state.players[playerId].playedCards, card],
          hand: (() => {
            const newHand = [...state.players[playerId].hand]
            const idx = newHand.indexOf(card)

            if (idx !== -1) newHand.splice(idx, 1)
            return newHand
          })(),
          ready: true,
        }
      }
    }))

    get().handleComputerTurns()
    get().startNextPhase()
  },
  handleComputerTurns: () => {
    const { players, phase, placeCard } = get()
    let i = 0
    
    if (phase !== 'opening' && phase !== 'placing') return
    
    Object.values(players).find((player) => {
      if (player.isComputer && !player.ready) {
        console.log({ player }, i++)
        const randCard = player.hand[Math.floor(Math.random() * player.hand.length)]

        placeCard(player.id, randCard)
      }
    })
  },
  // advancePhase: () => set((state) => ({phaseIdx: state.phaseIdx === 3 ? 0 : state.phaseIdx + 1, phase:})),
  startGame: () => set(() => ({ isGameRunning: true })),
  addPlayer: (player) => set((state) => ({ players: { ...state.players, [player.id]: player }})),
}))

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

export const useGameStateStore = createSelectors(gameStore)
