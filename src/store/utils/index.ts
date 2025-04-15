import { StoreApi, UseBoundStore } from 'zustand'
import {
  allPlayersPlacedOne,
  allPlayersReady,
  getActivePlayers,
  checkAllPlayers,
  getRandomPlayer,
  getPlayerIndexById,
  updatePlayerState,
  hasFlippedAllOwnCards,
  stubPlayers,
} from './playerHelpers'
import {
  getRandomCard,
  getRandomCardIndex,
  isCardFlipped,
  cardValue,
  removeTopCard,
  topUnflippedIndex,
} from './cardHelpers'
import { useGameStateStore } from '..'

export const getMaximumBet = () => {
  const players = useGameStateStore.getState().players

  return Object.values(players).reduce(
    (acc, player) => player.playedCards.length + acc,
    0
  )
}

// eslint-disable-next-line
export const sleep = (fn: () => any, ms?: number) => {
  const timeInMs = ms ?? 2000

  return setTimeout(fn, timeInMs)
}

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
    // eslint-disable-next-line
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

export {
  getRandomCardIndex,
  getRandomCard,
  isCardFlipped,
  cardValue,
  removeTopCard,
  topUnflippedIndex,
  allPlayersReady,
  allPlayersPlacedOne,
  checkAllPlayers,
  getActivePlayers,
  getRandomPlayer,
  getPlayerIndexById,
  updatePlayerState,
  hasFlippedAllOwnCards,
  stubPlayers,
}
