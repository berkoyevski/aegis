import { computeIncome } from './systems/economy'
import type { Action, Country, CountryId, GameState } from './types'

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'PAUSE':
      return { ...state, paused: true }

    case 'RESUME':
      return { ...state, paused: false }

    case 'SET_SPEED':
      return { ...state, speed: action.speed }

    case 'SELECT_REGION':
      return { ...state, selectedRegionId: action.regionId }

    case 'TICK': {
      const countries: Record<CountryId, Country> = {}
      for (const [id, country] of Object.entries(state.countries)) {
        const income = computeIncome(state, id)
        countries[id] = { ...country, treasury: country.treasury + income }
      }
      return { ...state, gameTime: state.gameTime + 1, countries }
    }

    case 'ACTIVATE_INITIATIVE':
    case 'DEACTIVATE_INITIATIVE':
    case 'EXECUTE_OPERATION':
    case 'RESET':
      return state

    default:
      return action satisfies never
  }
}
