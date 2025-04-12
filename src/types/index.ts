export type Player = {
  id: number
  name: string
  hand: Cards
  playedCards: Cards
  discarded: Cards
  challengesWon: number
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
  rounds: number
  phases: Phase[]
  phaseIdx: number
  phase: Phase
  currentHighBet: number
  flippedCards: FlippedCard[]
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
  setPlayerState: (
    playerId: number,
    prop: keyof Player,
    value: boolean | string | number | number[] | string[]
  ) => void
  placeCard: (playerId: number, card: Card) => void
  placeBet: (playerId: number, bet: number) => void
  passBet: (playerId: number) => void
  flipCard: (playerMatId: number, cardIdx: number) => void
}

export type TurnSlice = {
  playerTurn: Player
  setPlayerTurn: (playerId: number) => void
  passTurn: () => void
}

export type Card = 0 | 1
export type Cards = Card[]
export type FlippedCard = { playerId: number; index: number }

export type GameState = GameSlice & PlayerSlice & TurnSlice

export type Phase =
  | 'opening'
  | 'placing'
  | 'betting'
  | 'flipping'
  | 'discarding'
