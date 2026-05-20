import { create } from 'zustand'
import { buildInitialState } from '../core/init'
import { reduce } from '../core/reducer'
import type { Action, GameState, Scenario } from '../core/types'
import turkiye from '../data/countries/turkiye.json'
import developmentScenario from '../data/scenarios/development-turkiye.json'

type GameStore = GameState & {
  dispatch: (action: Action) => void
  reset: () => void
}

function makeInitial(): GameState {
  return buildInitialState(developmentScenario as Scenario, turkiye)
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
