import { StateCreator } from 'zustand'
import { GameState, PlayerSlice, Player } from '../types'
import { getRandomCard, stubPlayers, allPlayersReady, allPlayersPlacedOne } from './utils'

export const createPlayerSlice: StateCreator<GameState, [], [], PlayerSlice> = (set, get) => ({
  players: stubPlayers,
  currentChallenger: stubPlayers[1],
  addPlayer: (player: Player) => set((state) => ({ players: { ...state.players, [player.id]: player } })),
  deactivatePlayer: (player) => {
    set((state) => ({ 
      players: { 
        ...state.players, 
        [player.id]: {
          ...state.players[player.id],
          isInactive: true,
        }
      }
    }))
  },

  resetAllPlayersStatus: (prop, value) => set((state) => ({
    players: Object.fromEntries((Object.entries(state.players).map(([id, player]) => 
    [id, {...player, [prop]: value}])))
  })),

  // KEEP THIS FUNCTION PURE
  placeCard: (playerId, card) => {
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

  // KEEP THIS FUNCTION PURE
  placeBet: (playerId, bet) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          currentBet: bet
        }
      }
    }))

    set({ currentHighBet: bet })
  },

  passBet: (playerId) => { 
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: { 
          ...state.players[playerId],
          hasPassedBetting: true 
        }
      }
    }))
  },

  // TODO - Split this function into smaller functions for each specific phase
  handleComputerTurns: () => {
    const { 
      players, 
      phase, 
      placeCard, 
      playerTurn, 
      passTurn, 
      handleComputerTurns, 
      startNextPhase,
      currentHighBet,
      placeBet 
    } = get()

    if (phase === 'opening') {
      if (!allPlayersPlacedOne(players)) {
        const computerPlayer = Object.values(players).find((player) => player.isComputer && !player.ready)

        if (computerPlayer === undefined) return
        if (computerPlayer?.playedCards.length !== 1) {
          setTimeout(() => {
            const randCard = getRandomCard(computerPlayer)
  
            placeCard(computerPlayer?.id || 2, randCard)
            handleComputerTurns()
          }, Math.random() * 1200)
        }
      }

      if (allPlayersReady(players) && allPlayersPlacedOne(players)) {
        return startNextPhase()
      }
    }

    if (phase === 'placing' && playerTurn?.isComputer) {
      const computerPlayer = playerTurn
      if (!computerPlayer) return

      if (computerPlayer.hand.length === 0) return startNextPhase()

      setTimeout(() => {
        placeCard(computerPlayer.id, getRandomCard(computerPlayer))
        passTurn()
        handleComputerTurns()
      }, Math.random() * 2600)
    }

    if (phase === 'betting' && playerTurn?.isComputer) {
      const computerPlayer = playerTurn
      const maxBet = Object.values(players).reduce((acc, player) => (player.playedCards.length + acc), 0)

      if (currentHighBet === maxBet) return startNextPhase()

      setTimeout(() => {
        placeBet(computerPlayer.id, currentHighBet + 1)
        passTurn()
        handleComputerTurns()
      }, Math.random() * 2000)
    }
  }
})
