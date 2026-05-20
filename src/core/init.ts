import type {
  Coordinate,
  Country,
  GameState,
  Polygon,
  Region,
  RegionId,
  Scenario,
} from './types'

type RawRegion = {
  id: string
  name: string
  polygon: number[][]
  population: { total: number; happiness: number }
  description?: string
}

type RawCountry = {
  id: string
  name: string
  capitalRegionId: string
  traits: string[]
  regions: RawRegion[]
}

function toPolygon(raw: number[][]): Polygon {
  return raw.map((p) => [p[0], p[1]] as Coordinate)
}

export function buildInitialState(
  scenario: Scenario,
  countryData: RawCountry
): GameState {
  const overrides = scenario.initialState.regionOverrides ?? {}

  const regions: Record<RegionId, Region> = {}
  for (const raw of countryData.regions) {
    const ov = overrides[raw.id] ?? {}
    regions[raw.id] = {
      id: raw.id,
      name: raw.name,
      countryId: countryData.id,
      polygon: toPolygon(raw.polygon),
      population: {
        total: raw.population.total,
        happiness: ov.happiness ?? raw.population.happiness,
      },
      stability: ov.stability ?? 50,
      control: ov.control ?? { ownerId: countryData.id, level: 50 },
      hiddenThreat: ov.hiddenThreat ?? 0,
      intel: ov.intel ?? 50,
      activeInitiatives: [],
    }
  }

  const country: Country = {
    id: countryData.id,
    name: countryData.name,
    capitalRegionId: countryData.capitalRegionId,
    traits: countryData.traits,
    treasury: scenario.initialState.treasury,
    reputations: scenario.initialState.reputations.map((r) => ({ ...r })),
    relations: {},
  }

  return {
    gameTime: 0,
    paused: true,
    speed: 1,
    rngSeed: scenario.rngSeed ?? Math.floor(Math.random() * 1_000_000),
    scenarioId: scenario.id,
    countries: { [country.id]: country },
    regions,
    playerCountryId: country.id,
    status: 'playing',
    selectedRegionId: null,
    activeEvent: null,
    victoryCondition: scenario.victoryCondition,
    defeatConditions: scenario.defeatConditions,
  }
}
