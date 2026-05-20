import { getInitiative } from '../initiatives'
import type { Country, CountryId, GameState, Region, RegionId } from '../types'
import { clamp } from '../util'
import { CRISIS_THRESHOLD, makeInsurgentAttack } from './crisis'
import { computeIncome } from './economy'

const THREAT_GROWTH = 0.15

export function tickState(state: GameState): GameState {
  const regions: Record<RegionId, Region> = {}
  let initiativeIncome = 0
  let totalUpkeep = 0

  for (const region of Object.values(state.regions)) {
    let stability = region.stability
    let intel = region.intel
    let hiddenThreat = region.hiddenThreat
    let happiness = region.population.happiness

    hiddenThreat += THREAT_GROWTH * (1 - stability / 100)

    for (const id of region.activeInitiatives) {
      const init = getInitiative(id)
      if (!init) continue
      const e = init.effects
      if (e.stabilityBonus) stability += e.stabilityBonus
      if (e.happinessBonus) happiness += e.happinessBonus
      if (e.intelBonus) intel += e.intelBonus
      if (e.threatReduction) hiddenThreat -= e.threatReduction
      if (e.incomeBonus) initiativeIncome += e.incomeBonus
      if (init.upkeep) totalUpkeep += init.upkeep
    }

    regions[region.id] = {
      ...region,
      stability: clamp(stability, 0, 100),
      intel: clamp(intel, 0, 100),
      hiddenThreat: clamp(hiddenThreat, 0, 100),
      population: {
        ...region.population,
        happiness: clamp(happiness, 0, 100),
      },
    }
  }

  const tickedState: GameState = { ...state, regions }

  const countries: Record<CountryId, Country> = {}
  for (const [id, country] of Object.entries(state.countries)) {
    const baseIncome = computeIncome(tickedState, id)
    const extra =
      id === state.playerCountryId ? initiativeIncome - totalUpkeep : 0
    countries[id] = {
      ...country,
      treasury: country.treasury + baseIncome + extra,
    }
  }

  const advanced: GameState = {
    ...tickedState,
    gameTime: state.gameTime + 1,
    countries,
  }

  if (!advanced.activeEvent) {
    for (const region of Object.values(regions)) {
      if (region.hiddenThreat >= CRISIS_THRESHOLD) {
        const drained: Region = {
          ...region,
          hiddenThreat: clamp(region.hiddenThreat - 30, 0, 100),
          stability: clamp(region.stability - 8, 0, 100),
        }
        return {
          ...advanced,
          regions: { ...regions, [region.id]: drained },
          activeEvent: makeInsurgentAttack(region),
          paused: true,
        }
      }
    }
  }

  return advanced
}
