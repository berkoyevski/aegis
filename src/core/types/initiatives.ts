import type { InitiativeId, ReputationId } from './ids'

export type InitiativeBranch = 'governance' | 'security' | 'economy'

export type InitiativeScope = 'country' | 'region'

export type InitiativeEffects = {
  incomeBonus?: number
  stabilityBonus?: number
  happinessBonus?: number
  intelBonus?: number
  threatReduction?: number
  reputationDelta?: { id: ReputationId; amount: number }[]
}

export type Initiative = {
  id: InitiativeId
  name: string
  description: string

  branch: InitiativeBranch
  tier: number

  cost: number
  upkeep?: number

  requires: InitiativeId[]

  effects: InitiativeEffects

  scope: InitiativeScope
}
