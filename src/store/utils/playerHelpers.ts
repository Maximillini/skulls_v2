import { useGameStateStore } from '..'
import { isCardFlipped } from '.'
import { Player, Players, FlippedCard, GameState } from './../../types/index'

export const allPlayersReady = (players: Players) =>
  Object.values(players).every((player) => player.ready)

export const allPlayersPlacedOne = (players: Players) =>
  Object.values(players).every((player) => player.playedCards?.length === 1)

export const checkAllPlayers = (
  players: Players,
  fn: (player: Player) => boolean
) => Object.values(players).every(fn)

export const getRandomPlayer = (players?: Players) => {
  const playerList = useGameStateStore.getState().players || players

  return Object.values(playerList)[
    Math.floor(Math.random() * Object.values(playerList).length)
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

/**
 * Returns a new list of players with the state of the given player by id updated, returns {@link Players}
 * @param state {@link GameState}
 * @param playerId id of the player to be updated
 * @param updates object containing the updated prop and value of state of the player
 *
 * @returns Players - an object containing a list of players with updated state
 */
export const updatePlayerState: (
  state: GameState,
  playerId: number,
  updates: Partial<Player>
) => { players: { [x: number]: Player } } = (state, playerId, updates) => ({
  players: {
    ...state.players,
    [playerId]: {
      ...state.players[playerId],
      ...updates,
    },
  },
})

export const hasFlippedAllOwnCards = (
  flippingPlayer: Player,
  flippedCards: FlippedCard[]
) =>
  flippingPlayer.playedCards.every((_, i) =>
    isCardFlipped(flippingPlayer.id, i, flippedCards)
  )

const fakePlayer: Player = {
  id: 1,
  name: 'Player-1',
  hand: [1, 1, 1, 0],
  playedCards: [],
  discarded: [],
  hasWonChallenge: false,
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
