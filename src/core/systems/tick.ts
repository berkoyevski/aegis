import { getInitiative } from '../initiatives'
import { INSURGENT_FACTION } from '../types'
import type {
  Country,
  CountryId,
  GameState,
  GameStatus,
  Region,
  RegionId,
} from '../types'
import { clamp } from '../util'
import { CRISIS_THRESHOLD, makeInsurgentAttack } from './crisis'
import { computeIncome } from './economy'

const THREAT_GROWTH = 0.15

function checkStatus(state: GameState): GameStatus {
  const player = state.countries[state.playerCountryId]

  for (const cond of state.defeatConditions) {
    if (cond.type === 'reputation_zero') {
      const rep = player.reputations.find((r) => r.id === cond.reputationId)
      if (rep && rep.value <= 0) return 'defeat'
    } else if (cond.type === 'capital_lost') {
      const capital = state.regions[player.capitalRegionId]
      if (capital && capital.control.ownerId !== state.playerCountryId) {
        return 'defeat'
      }
    }
  }

  if (state.victoryCondition.type === 'stabilize_all') {
    const min = state.victoryCondition.minStability
    const allStable = Object.values(state.regions).every(
      (r) =>
        r.control.ownerId === state.playerCountryId && r.stability >= min
    )
    if (allStable) return 'victory'
  }

  return 'playing'
}

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

    const newStability = clamp(stability, 0, 100)
    const newThreat = clamp(hiddenThreat, 0, 100)

    let ownerId = region.control.ownerId
    let controlLevel = region.control.level
    if (ownerId === INSURGENT_FACTION && newStability >= 50 && newThreat < 30) {
      ownerId = state.playerCountryId
      controlLevel = 50
    } else if (
      ownerId === state.playerCountryId &&
      newStability < 12 &&
      newThreat > 88
    ) {
      ownerId = INSURGENT_FACTION
      controlLevel = 50
    }

    regions[region.id] = {
      ...region,
      stability: newStability,
      intel: clamp(intel, 0, 100),
      hiddenThreat: newThreat,
      control: { ownerId, level: controlLevel },
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

  const status = checkStatus(advanced)
  if (status !== 'playing') {
    return { ...advanced, status, paused: true }
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
