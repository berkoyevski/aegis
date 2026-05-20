import type { Country, EventEffect, GameState } from '../types'
import { clamp } from '../util'

export function applyEventEffect(
  state: GameState,
  effect: EventEffect
): GameState {
  let regions = state.regions
  if (effect.regionId) {
    const region = state.regions[effect.regionId]
    if (region) {
      regions = {
        ...state.regions,
        [region.id]: {
          ...region,
          stability: clamp(region.stability + (effect.stabilityDelta ?? 0), 0, 100),
          hiddenThreat: clamp(
            region.hiddenThreat + (effect.threatDelta ?? 0),
            0,
            100
          ),
          intel: clamp(region.intel + (effect.intelDelta ?? 0), 0, 100),
          population: {
            ...region.population,
            happiness: clamp(
              region.population.happiness + (effect.happinessDelta ?? 0),
              0,
              100
            ),
          },
        },
      }
    }
  }

  const player = state.countries[state.playerCountryId]
  const updatedPlayer: Country = {
    ...player,
    treasury: player.treasury + (effect.treasuryDelta ?? 0),
    reputations: player.reputations.map((rep) => {
      const delta = effect.reputationDeltas?.find((d) => d.id === rep.id)
      if (!delta) return rep
      return { ...rep, value: clamp(rep.value + delta.amount, 0, 100) }
    }),
  }

  return {
    ...state,
    regions,
    countries: {
      ...state.countries,
      [player.id]: updatedPlayer,
    },
  }
}
