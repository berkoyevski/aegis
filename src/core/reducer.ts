import type { Action, GameState } from './types'

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

    case 'TICK':
    case 'ACTIVATE_INITIATIVE':
    case 'DEACTIVATE_INITIATIVE':
    case 'EXECUTE_OPERATION':
    case 'RESET':
      return state

    default:
      return action satisfies never
  }
}
