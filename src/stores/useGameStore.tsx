import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

type Phase = 'opening' | 'placing' | 'betting' | 'flipping' | 'discarding'
const PHASES: Phase[] = ['opening', 'placing', 'betting', 'flipping', 'discarding']

export type Player = {
  id: number,
  name: string,
  hand: (0 | 1)[],
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
  playerTurn: Player,
  phases: typeof PHASES
  phaseIdx: number,
  phase: Phase,
  startNextPhase: () => void,
  placeCard: (playerId: number, card: 0 | 1) => void,
  handleComputerTurns: () => void,
  passTurn: () => void,
  advancePhase: () => void,
  resetPlayerReadyStatus: () => void,
  changeToPhase: (phase: Phase) => void, 
  startGame: () => void,
  addPlayer: (player: Player) => void,
}

const getRandomCard = (player: Player) => player.hand[Math.floor(Math.random() * player.hand.length - 1)]
const allPlayersReady = (players: Record<number, Player>) => Object.values(players).every((player) => player.ready)
const checkAllPlayers = (players: Record<number, Player>, fn: (player: Player) => boolean) => {
  Object.values(players).every(fn)
}

export const gameStore = create<GameState>()(devtools((set, get) => ({
  isGameRunning: false,
  players: stubPlayers,
  playerCount: () => Object.values(get().players).length,
  playerTurn: stubPlayers[2],
  phases: PHASES,
  phaseIdx: 0,
  phase: 'opening' as Phase,
  startNextPhase: () => {
    const { phase, changeToPhase, players } = get()

    if (phase === 'opening' && allPlayersReady(players)) {
      changeToPhase('placing')
      set({ playerTurn: players[Math.floor(Math.random() * Object.values(players).length)] })
    }
  },
  placeCard: (playerId: number, card: 0 | 1) => {
    if (get().players[playerId].ready) return

    console.log({ playerId })

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
    if (get().phase === 'opening') get().startNextPhase()
  },
  handleComputerTurns: () => {
    const { players, phase, placeCard, playerTurn, passTurn } = get()
    if (phase !== 'opening' && phase !== 'placing') return
    
    if (phase === 'opening') {
      Object.values(players).find((player) => {
        if (player.isComputer && !player.ready) {
          setTimeout(() => {
            const randCard = getRandomCard(player)
  
            placeCard(player.id, randCard)
          }, Math.random() * 1200)
        }
      })
    }

    if (phase === 'placing' && playerTurn?.isComputer && checkAllPlayers(players, (player) => player.playedCards.length === 1)) {
      const computerPlayer = players[playerTurn.id]

      console.log({ computerPlayer })

      setTimeout(() => {
        debugger
        // TODO - add logic to decide whether to bet or place card, and which card to place
        placeCard(computerPlayer.id, getRandomCard(computerPlayer))
        passTurn()
      }, Math.random() * 2000)
    }
  },
  passTurn: () => {
    const { playerTurn, phase, players } = get()

    if (phase !== 'placing' && phase !== 'betting') return

    const playerId = playerTurn.id

    debugger

    if (playerId === 4) {
      set({ playerTurn: players[1] })
    } else {
      set({ playerTurn: players[playerId + 1]})
    }
  },
  resetPlayerReadyStatus: () => (set((state) => ({
    players: Object.keys(state.players).reduce<Record<string, Player>>((acc, playerId) => ({
      ...acc,
      [playerId]: {
        ...state.players[playerId],
        ready: false
      }
    }), {}),
  }))),
  changeToPhase: (phase: Phase) => set({ phase }),
  startGame: () => set(() => ({ isGameRunning: true })),
  addPlayer: (player) => set((state) => ({ players: { ...state.players, [player.id]: player }})),
})))
