export type Player = {
  id: number,
  name: string,
  hand: (0 | 1)[],
  playedCards: number[]
  discarded: string[],
  challengesWon: 0 | 1 | 2,
  // TODO - Think of more descriptive name than 'ready'
  ready: boolean,
  isComputer?: boolean,
  hasPassedBetting: boolean
}

export type Players = Record<number, Player>

export type GameSlice = {
  isGameRunning: boolean,
  phases: Phase[]
  phaseIdx: number,
  phase: Phase,
  startGame: () => void,
  changeToPhase: (phase: Phase) => void,
  startNextPhase: () => void,
}

export type PlayerSlice = {
  players: Record<number, Player>,
  addPlayer: (player: Player) => void,
  resetPlayerReadyStatus: () => void,
  placeCard: (playerId: number, card: 0 | 1) => void,
  handleComputerTurns: () => void,
}

export type TurnSlice = {
  playerTurn: Player,
  passTurn: () => void,
}

export type GameState = GameSlice & PlayerSlice & TurnSlice

export type Phase = 'opening' | 'placing' | 'betting' | 'flipping' | 'discarding'
