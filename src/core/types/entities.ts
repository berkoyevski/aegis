import type { Polygon } from './geometry'
import type {
  CountryId,
  FactionId,
  InitiativeId,
  RegionId,
  ReputationId,
} from './ids'

export type Population = {
  total: number
  happiness: number
}

export type Control = {
  ownerId: FactionId
  level: number
}

export type Region = {
  id: RegionId
  name: string
  countryId: CountryId
  polygon: Polygon

  population: Population
  stability: number

  control: Control

  hiddenThreat: number
  intel: number

  activeInitiatives: InitiativeId[]
}

export type Reputation = {
  id: ReputationId
  label: string
  value: number
}

export type Country = {
  id: CountryId
  name: string
  capitalRegionId: RegionId

  traits: string[]

  treasury: number

  reputations: Reputation[]

  relations: Record<CountryId, number>
}
