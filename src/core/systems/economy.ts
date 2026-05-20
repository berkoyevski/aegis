import type { CountryId, GameState } from '../types'

const TAX_RATE = 1.0

export function computeIncome(state: GameState, countryId: CountryId): number {
  let income = 0
  for (const region of Object.values(state.regions)) {
    if (region.control.ownerId !== countryId) continue
    const stabilityFactor = region.stability / 100
    const popFactor = region.population.total / 100000
    income += stabilityFactor * popFactor * TAX_RATE
  }
  return Math.round(income)
}
