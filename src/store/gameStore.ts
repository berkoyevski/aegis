import { create } from 'zustand'
import { buildInitialState } from '../core/init'
import { reduce } from '../core/reducer'
import type { Action, GameState, Scenario } from '../core/types'
import karastan from '../data/countries/karastan.json'
import insurgencyScenario from '../data/scenarios/insurgency-karastan.json'

type GameStore = GameState & {
  dispatch: (action: Action) => void
  reset: () => void
}

function makeInitial(): GameState {
  return buildInitialState(insurgencyScenario as Scenario, karastan)
}

export const useGameStore = create<GameStore>((set) => ({
  ...makeInitial(),

  dispatch: (action) =>
    set((state) => {
      const { dispatch, reset, ...gameState } = state
      const next = reduce(gameState, action)
      return next
    }),

  reset: () => set({ ...makeInitial() }),
}))
