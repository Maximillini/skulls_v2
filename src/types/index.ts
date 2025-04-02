export type Player = {
  id: number
  name: string
  hand: Cards
  playedCards: Cards
  discarded: Cards
  challengesWon: number
  flippedOwnCards: boolean
  // TODO - Think of more descriptive name than 'ready'
  ready: boolean
  isComputer?: boolean
  isInactive: boolean
  hasPassedBetting: boolean
  currentBet: number
}

export type Players = Record<number, Player>

export type GameSlice = {
  isGameRunning: boolean
  phases: Phase[]
  phaseIdx: number
  phase: Phase
  currentHighBet: number
  flippedCards: Cards[]
  startGame: () => void
  changeToPhase: (phase: Phase) => void
  startNextPhase: () => void
}

export type PlayerSlice = {
  players: Record<number, Player>
  addPlayer: (player: Player) => void
  deactivatePlayer: (player: Player) => void
  resetAllPlayersStatus: (
    prop: keyof Player,
    value: boolean | string | number | number[] | string[]
  ) => void
  placeCard: (playerId: number, card: 0 | 1) => void
  placeBet: (playerId: number, bet: number) => void
  passBet: (playerId: number) => void
  flipCard: (playerId: number, card: Card, playerMatId: number) => void
}

export type TurnSlice = {
  playerTurn: Player
  passTurn: () => void
}

export type Card = 0 | 1
export type Cards = Card[]

export type GameState = GameSlice & PlayerSlice & TurnSlice

export type Phase =
  | 'opening'
  | 'placing'
  | 'betting'
  | 'flipping'
  | 'discarding'
