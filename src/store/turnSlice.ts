import { StateCreator } from 'zustand'
import { GameState, TurnSlice, Players } from '../types'
import { getActivePlayers, getPlayerIndexById, stubPlayers } from './utils'

const nonZeroRandom = (max: keyof Players) =>
  Math.floor(Math.random() * max) + 1

export const createTurnSlice: StateCreator<
  GameState,
  [['zustand/devtools', never]],
  [],
  TurnSlice
> = (set, get) => ({
  playerTurn: stubPlayers[nonZeroRandom(4)],

  setPlayerTurn: (playerId) =>
    set(
      (state) => ({ ...state, playerTurn: state.players[playerId] }),
      undefined,
      'turn/setPlayerTurn'
    ),
  passTurn: () => {
    const { playerTurn } = get()
    const activePlayers = getActivePlayers()
    const lastActivePlayer = activePlayers[activePlayers.length - 1]
    const currentActivePlayerIndex = getPlayerIndexById(
      activePlayers,
      playerTurn.id
    )

    set(
      {
        playerTurn:
          playerTurn.id === lastActivePlayer.id
            ? activePlayers[0]
            : activePlayers[currentActivePlayerIndex + 1],
      },
      undefined,
      'turn/passTurn'
    )
  },
})
