import { StateCreator } from 'zustand'
import { GameState, PlayerSlice, Player } from '../types'
import { stubPlayers, updatePlayerState } from './utils'

export const createPlayerSlice: StateCreator<
  GameState,
  [['zustand/devtools', never]],
  [],
  PlayerSlice
> = (set) => ({
  players: stubPlayers,
  addPlayer: (player: Player) =>
    set(
      (state) => ({ players: { ...state.players, [player.id]: player } }),
      undefined,
      'player/addPlayer'
    ),

  deactivatePlayer: (player) => {
    set(
      (state) => ({
        ...state,
        ...updatePlayerState(state, player.id, { isInactive: true }),
      }),
      undefined,
      'player/deactivatePlayer'
    )
  },

  setPlayerState: (playerId, prop, value) =>
    set(
      (state) => ({
        ...state,
        ...updatePlayerState(state, playerId, { [prop]: value }),
      }),
      undefined,
      'player/setPlayerState'
    ),

  resetAllPlayersStatus: (prop, value) =>
    set(
      (state) => ({
        players: Object.fromEntries(
          Object.entries(state.players).map(([id, player]) => [
            id,
            { ...player, [prop]: value },
          ])
        ),
      }),
      undefined,
      'player/resetAllPlayersStatus'
    ),

  placeCard: (playerId, card) => {
    set(
      (state) =>
        updatePlayerState(state, playerId, {
          playedCards: [...state.players[playerId].playedCards, card],
          hand: (() => {
            const newHand = [...state.players[playerId].hand]
            const idx = newHand.indexOf(card)

            if (idx !== -1) newHand.splice(idx, 1)
            return newHand
          })(),
          ready: true,
        }),
      undefined,
      'player/placeCard'
    )
  },

  placeBet: (playerId, bet) => {
    set(
      (state) => ({
        ...{ currentHighBet: bet },
        ...updatePlayerState(state, playerId, { currentBet: bet }),
      }),
      undefined,
      'player/placeBet'
    )
  },

  passBet: (playerId) => {
    set(
      (state) => updatePlayerState(state, playerId, { hasPassedBetting: true }),
      undefined,
      'player/passBet'
    )
  },

  flipCard: (playerMatId, cardIdx) => {
    set(
      (state) => ({
        ...state,
        flippedCards: [
          ...state.flippedCards,
          { playerId: playerMatId, index: cardIdx },
        ],
      }),
      undefined,
      'player/flipCard'
    )
  },
})
