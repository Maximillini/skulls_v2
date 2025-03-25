import { StoreApi, UseBoundStore } from 'zustand'
import { Player, Players } from "../types"

export const allPlayersReady = (players: Players) => 
  Object.values(players).every((player) => player.ready)

export const allPlayersPlacedOne = (players: Players) => Object.values(players).every((player) => player.playedCards.length === 1)

export const checkAllPlayers = (
  players: Players, fn: (player: Player) => boolean
) => (Object.values(players).every(fn))

export const getRandomCard = (player: Player) => 
  player.hand[Math.floor(Math.random() * (player.hand.length - 1))]

export const getRandomPlayer = (players: Record<string, Player>) => (
  players[Math.floor(Math.random() * (Object.values(players).length - 1))]
)

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

const fakePlayer: Player = {
  id: 1,
  name: 'Player-1',
  hand: [1, 1, 1, 0],
  playedCards: [],
  discarded: [],
  challengesWon: 0,
  ready: false,
  hasPassedBetting: false
}

export const stubPlayers = {
  1: fakePlayer,
  2: {...fakePlayer, id: 2, name: 'Player-2', isComputer: true },
  3: {...fakePlayer, id: 3, name: 'Player-3', isComputer: true },
  4: {...fakePlayer, id: 4, name: 'Player-4', isComputer: true },
}
