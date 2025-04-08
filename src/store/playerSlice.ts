import { StateCreator } from 'zustand'
import { GameState, PlayerSlice, Player, Cards } from '../types'
import { removeTopCard, stubPlayers, updatePlayerState } from './utils'

export const createPlayerSlice: StateCreator<
  GameState,
  [['zustand/devtools', never]],
  [],
  PlayerSlice
> = (set) => ({
  players: stubPlayers,
  playerHasFlippedOwnCards: (playerId) => (state: GameState) =>
    state.players[playerId].playedCards.length <= 1,

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

  // KEEP THIS FUNCTION PURE
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

  // KEEP THIS FUNCTION PURE
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

  flipCard: (card, playerMatId) => {
    set(
      (state) => ({
        ...state,
        flippedCards: [...state.flippedCards, card] as Cards,
        players: {
          ...state.players,
          [playerMatId]: {
            ...state.players[playerMatId],
            playedCards: (() =>
              removeTopCard(state.players[playerMatId].playedCards))(),
            tempCardZone: (() => [
              ...state.players[playerMatId].tempCardZone,
              card,
            ])(),
          },
        },
      }),
      undefined,
      'player/flipCard'
    )
  },
})
