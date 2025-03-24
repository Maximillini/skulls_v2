import { StateCreator } from 'zustand'
import { GameState, TurnSlice } from '../types'
import { stubPlayers } from './utils'

export const createTurnSlice: StateCreator<GameState, [], [], TurnSlice> = (set, get) => ({
  playerTurn: stubPlayers[2],

  passTurn: () => {
    const { playerTurn, players } = get()

    set({ playerTurn: players[playerTurn.id === 4 ? 1 : playerTurn.id + 1]})
  }
})
