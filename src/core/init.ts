import { smoothClosedPath } from '../ui/map/smoothPath'
import type {
  Coordinate,
  Country,
  GameState,
  Region,
  RegionId,
  Scenario,
} from './types'

const DEFAULT_VIEWBOX = '-120 -90 1040 580'

type RawRegion = {
  id: string
  name: string
  polygon?: number[][]
  path?: string
  labelX?: number
  labelY?: number
  population: number | { total: number; happiness: number }
  happiness?: number
  description?: string
}

type RawCountry = {
  id: string
  name: string
  capitalRegionId: string
  traits: string[]
  viewBox?: string
  regions: RawRegion[]
}

function toPolygon(raw: number[][]): Coordinate[] {
  return raw.map((p) => [p[0], p[1]] as Coordinate)
}

function regionShape(raw: RawRegion): {
  path: string
  labelX: number
  labelY: number
} {
  if (raw.path) {
    return {
      path: raw.path,
      labelX: raw.labelX ?? 0,
      labelY: raw.labelY ?? 0,
    }
  }
  const poly = toPolygon(raw.polygon ?? [])
  const cx = poly.reduce((s, [x]) => s + x, 0) / poly.length
  const cy = poly.reduce((s, [, y]) => s + y, 0) / poly.length
  return {
    path: smoothClosedPath(poly),
    labelX: raw.labelX ?? cx,
    labelY: raw.labelY ?? cy,
  }
}

function regionPop(raw: RawRegion): { total: number; baseHappiness: number } {
  if (typeof raw.population === 'number') {
    return { total: raw.population, baseHappiness: raw.happiness ?? 50 }
  }
  return { total: raw.population.total, baseHappiness: raw.population.happiness }
}

export function buildInitialState(
  scenario: Scenario,
  countryData: RawCountry
): GameState {
  const overrides = scenario.initialState.regionOverrides ?? {}

  const regions: Record<RegionId, Region> = {}
  for (const raw of countryData.regions) {
    const ov = overrides[raw.id] ?? {}
    const shape = regionShape(raw)
    const pop = regionPop(raw)
    regions[raw.id] = {
      id: raw.id,
      name: raw.name,
      countryId: countryData.id,
      path: shape.path,
      labelX: shape.labelX,
      labelY: shape.labelY,
      population: {
        total: pop.total,
        happiness: ov.happiness ?? pop.baseHappiness,
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
    scenarioName: scenario.name,
    countries: { [country.id]: country },
    regions,
    playerCountryId: country.id,
    status: 'playing',
    selectedRegionId: null,
    activeEvent: null,
    victoryCondition: scenario.victoryCondition,
    defeatConditions: scenario.defeatConditions,
    operationCooldowns: {},
    mapViewBox: countryData.viewBox ?? DEFAULT_VIEWBOX,
  }
}
