import { useGameStateStore } from '../store'
import { Phase } from '../types'

export const usePhase = () => {
  const phase = useGameStateStore.use.phase()
  const changeToPhase = useGameStateStore.use.changeToPhase()

  const isPhase = (p: Phase) => phase === p

  return { phase, isPhase, changeToPhase }
}
