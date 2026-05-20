import type { RegionId, ReputationId } from './ids'

export type EventEffect = {
  regionId?: RegionId
  stabilityDelta?: number
  threatDelta?: number
  happinessDelta?: number
  intelDelta?: number
  treasuryDelta?: number
  reputationDeltas?: { id: ReputationId; amount: number }[]
}

export type EventChoice = {
  label: string
  description?: string
  effect: EventEffect
}

export type GameEvent = {
  id: string
  title: string
  description: string
  regionId?: RegionId
  choices: EventChoice[]
}
