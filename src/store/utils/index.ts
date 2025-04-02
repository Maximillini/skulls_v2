import { StoreApi, UseBoundStore } from 'zustand'
import { Card, GameState, Player, Players } from '../../types'
import { useGameStateStore } from '..'

export const allPlayersReady = (players: Players) =>
  Object.values(players).every((player) => player.ready)

export const allPlayersPlacedOne = (players: Players) =>
  Object.values(players).every((player) => player.playedCards.length === 1)

export const checkAllPlayers = (
  players: Players,
  fn: (player: Player) => boolean
) => Object.values(players).every(fn)

export const getRandomCard = (player: Player) =>
  player.hand[Math.floor(Math.random() * player.hand.length)]

export const getRandomPlayer = () => {
  const players = useGameStateStore.getState().players

  return Object.values(players)[
    Math.floor(Math.random() * Object.values(players).length)
  ]
}

export const getActivePlayers = () => {
  const players = useGameStateStore.getState().players

  return Object.values(players).filter((player) => !player.isInactive)
}

export const getPlayerIndexById = (
  players: Record<number, Player>,
  playerId: number
) => Object.values(players).findIndex((player) => player.id === playerId)

export const getMaximumBet = () => {
  const players = useGameStateStore.getState().players

  return Object.values(players).reduce(
    (acc, player) => player.playedCards.length + acc,
    0
  )
}

export const updatePlayerState = (
  state: GameState,
  playerId: number,
  updates: Partial<Player>
) => ({
  players: {
    ...state.players,
    [playerId]: {
      ...state.players[playerId],
      ...updates,
    },
  },
})

export const isFlippable = (
  playerMat: Player,
  player: Player,
  idx: number,
  cards: (0 | 1)[]
) => {
  const phase = useGameStateStore.getState().phase
  const isTopCard = idx === cards.length - 1
  const isFlippingPhase = phase === 'flipping'
  const isPlayersOwnMat = player.id === playerMat.id

  return (
    isTopCard && isFlippingPhase && (isPlayersOwnMat || player.flippedOwnCards)
  )
}

export const cardValue = (card: Card) => (card === 1 ? '🌸' : '💀')

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

/**
 *
 * @param _store A Zustand store
 * @returns store object with 'use' property bound to each state and action on the provided Zustand store
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

const fakePlayer: Player = {
  id: 1,
  name: 'Player-1',
  hand: [1, 1, 1, 0],
  playedCards: [],
  flippedOwnCards: false,
  discarded: [],
  challengesWon: 0,
  ready: false,
  hasPassedBetting: false,
  currentBet: 0,
  isInactive: false,
}

export const stubPlayers = {
  1: fakePlayer,
  2: { ...fakePlayer, id: 2, name: 'Player-2', isComputer: true },
  3: { ...fakePlayer, id: 3, name: 'Player-3', isComputer: true },
  4: { ...fakePlayer, id: 4, name: 'Player-4', isComputer: true },
}
