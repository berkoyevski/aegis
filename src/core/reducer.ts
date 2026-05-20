import { getInitiative } from './initiatives'
import { applyEventEffect } from './systems/events'
import { tickState } from './systems/tick'
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
      return tickState(state)

    case 'ACTIVATE_INITIATIVE': {
      const region = state.regions[action.regionId]
      const initiative = getInitiative(action.initiativeId)
      if (!region || !initiative) return state
      if (region.activeInitiatives.includes(initiative.id)) return state

      const player = state.countries[state.playerCountryId]
      if (player.treasury < initiative.cost) return state

      const reqsMet = initiative.requires.every((r) =>
        region.activeInitiatives.includes(r)
      )
      if (!reqsMet) return state

      return {
        ...state,
        countries: {
          ...state.countries,
          [player.id]: {
            ...player,
            treasury: player.treasury - initiative.cost,
          },
        },
        regions: {
          ...state.regions,
          [region.id]: {
            ...region,
            activeInitiatives: [...region.activeInitiatives, initiative.id],
          },
        },
      }
    }

    case 'DEACTIVATE_INITIATIVE': {
      const region = state.regions[action.regionId]
      if (!region || !region.activeInitiatives.includes(action.initiativeId)) {
        return state
      }
      return {
        ...state,
        regions: {
          ...state.regions,
          [region.id]: {
            ...region,
            activeInitiatives: region.activeInitiatives.filter(
              (id) => id !== action.initiativeId
            ),
          },
        },
      }
    }

    case 'RESOLVE_EVENT': {
      if (!state.activeEvent) return state
      const choice = state.activeEvent.choices[action.choiceIndex]
      if (!choice) return state
      const applied = applyEventEffect(state, choice.effect)
      return { ...applied, activeEvent: null }
    }

    case 'EXECUTE_OPERATION':
    case 'RESET':
      return state

    default:
      return action satisfies never
  }
}
