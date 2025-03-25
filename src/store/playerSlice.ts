import { StateCreator } from 'zustand'
import { GameState, PlayerSlice, Player } from '../types'
import { getRandomCard, checkAllPlayers, stubPlayers } from './utils'

export const createPlayerSlice: StateCreator<GameState, [], [], PlayerSlice> = (set, get) => ({
  players: stubPlayers,

  addPlayer: (player: Player) => set((state) => ({ players: { ...state.players, [player.id]: player } })),

  resetPlayerReadyStatus: () => set((state) => ({
    players: Object.fromEntries((Object.entries(state.players).map(([id, player]) => [id, { ...player, ready: false }])))
  })),

  // KEEP THIS FUNCTION PURE
  placeCard: (playerId: number, card: 0 | 1) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          playedCards: [...state.players[playerId].playedCards, card],
          hand: (() => {
            const newHand = [...state.players[playerId].hand]
            const idx = newHand.indexOf(card)

            if (idx !== -1) newHand.splice(idx, 1)
            return newHand
          })(),
          ready: true,
        }
      }
    }))
  },

  handleComputerTurns: () => {
    const { players, phase, placeCard, playerTurn, passTurn, handleComputerTurns } = get()
    if (phase !== 'opening' && phase !== 'placing') return
    
    console.log({ allPlayersPlaced: checkAllPlayers(players, (player) => player.playedCards.length === 1)})
    if (phase === 'opening') {
      if (!checkAllPlayers(players, (player) => player.playedCards.length === 1)) {
        const computerPlayer = Object.values(players).find((player) => player.isComputer && !player.ready)
        console.log({ computerPlayer })
        if (computerPlayer === undefined) return 
        if (computerPlayer?.playedCards.length !== 1) {
          setTimeout(() => {
            const randCard = getRandomCard(computerPlayer)
  
            placeCard(computerPlayer?.id || 2, randCard)
            handleComputerTurns()
          }, Math.random() * 1200)
        }
      }
    }

    if (phase === 'placing' && playerTurn?.isComputer) {
      const computerPlayer = playerTurn

      if (!computerPlayer) return

      setTimeout(() => {
        placeCard(computerPlayer.id, getRandomCard(computerPlayer))
        passTurn()
        handleComputerTurns()
      }, Math.random() * 2000)
    }
  }
})
