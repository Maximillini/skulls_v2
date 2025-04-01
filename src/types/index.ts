export type Player = {
  id: number,
  name: string,
  hand: (0 | 1)[],
  playedCards: (0 | 1)[]
  discarded: (0 | 1)[],
  challengesWon: number,
  flippedOwnCards: boolean,
  // TODO - Think of more descriptive name than 'ready'
  ready: boolean,
  isComputer?: boolean,
  isInactive: boolean,
  hasPassedBetting: boolean,
  currentBet: number,
}

export type Players = Record<number, Player>

export type GameSlice = {
  isGameRunning: boolean,
  phases: Phase[]
  phaseIdx: number,
  phase: Phase,
  currentHighBet: number,
  flippedCards: (1 | 0)[],
  startGame: () => void,
  changeToPhase: (phase: Phase) => void,
  startNextPhase: () => void,
}

export type PlayerSlice = {
  players: Record<number, Player>,
  addPlayer: (player: Player) => void,
  deactivatePlayer: (player: Player) => void,
  resetAllPlayersStatus: (prop: keyof Player, value: boolean | string | number | number[] | string[]) => void,
  placeCard: (playerId: number, card: 0 | 1) => void,
  placeBet: (playerId: number, bet: number) => void,
  passBet: (playerId: number) => void,
  flipCard: (playerId: number, card: 0 | 1, playerMatId: number) => void,
  handleComputerTurns: () => void,
}

export type TurnSlice = {
  playerTurn: Player,
  passTurn: () => void,
}

export type GameState = GameSlice & PlayerSlice & TurnSlice

export type Phase = 'opening' | 'placing' | 'betting' | 'flipping' | 'discarding'
