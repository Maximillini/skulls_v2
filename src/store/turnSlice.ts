import { StateCreator } from 'zustand'
import { GameState, TurnSlice } from '../types'
import { getActivePlayers, getPlayerIndexById, stubPlayers } from './utils'

export const createTurnSlice: StateCreator<GameState, [], [], TurnSlice> = (set, get) => ({
  playerTurn: stubPlayers[2],

  passTurn: () => {
    const { playerTurn } = get()
    const activePlayers = getActivePlayers(get().players)
    const lastActivePlayer = activePlayers[activePlayers.length - 1]
    const currentActivePlayerIndex = getPlayerIndexById(activePlayers, playerTurn.id)

    set({ playerTurn: playerTurn.id === lastActivePlayer.id ? activePlayers[0] : activePlayers[currentActivePlayerIndex + 1] })
  }
})
