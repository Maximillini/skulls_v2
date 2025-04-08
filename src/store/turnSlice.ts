import { StateCreator } from 'zustand'
import { GameState, TurnSlice } from '../types'
import { getActivePlayers, getPlayerIndexById, stubPlayers } from './utils'

export const createTurnSlice: StateCreator<
  GameState,
  [['zustand/devtools', never]],
  [],
  TurnSlice
> = (set, get) => ({
  playerTurn: stubPlayers[2],

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
