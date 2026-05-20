import type { Country, Region } from './entities'
import type { GameEvent } from './events'
import type { CountryId, OperationId, RegionId, ScenarioId } from './ids'
import type { DefeatCondition, VictoryCondition } from './scenarios'

export type GameStatus = 'playing' | 'victory' | 'defeat'

export type GameSpeed = 1 | 2 | 5

export type GameState = {
  gameTime: number
  paused: boolean
  speed: GameSpeed

  rngSeed: number

  scenarioId: ScenarioId
  scenarioName: string

  countries: Record<CountryId, Country>
  regions: Record<RegionId, Region>

  playerCountryId: CountryId

  status: GameStatus

  selectedRegionId: RegionId | null

  activeEvent: GameEvent | null

  victoryCondition: VictoryCondition
  defeatConditions: DefeatCondition[]

  operationCooldowns: Record<OperationId, number>

  mapViewBox: string
  mapLakes: { name: string; path: string }[]
  mapRivers: { name: string; path: string }[]
}
