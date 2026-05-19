import type { Country, Region } from './entities'
import type { CountryId, RegionId, ScenarioId } from './ids'

export type GameStatus = 'playing' | 'victory' | 'defeat'

export type GameSpeed = 1 | 2 | 5

export type GameState = {
  gameTime: number
  paused: boolean
  speed: GameSpeed

  rngSeed: number

  scenarioId: ScenarioId

  countries: Record<CountryId, Country>
  regions: Record<RegionId, Region>

  playerCountryId: CountryId

  status: GameStatus

  selectedRegionId: RegionId | null
}
