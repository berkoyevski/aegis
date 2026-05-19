import type { Reputation } from './entities'
import type { CountryId, ScenarioId } from './ids'

export type PlayerRole = 'governor' | 'leader'

export type EnabledFeatures = {
  diplomacy: boolean
  hiddenThreats: boolean
  interstateWar: boolean
}

export type VictoryCondition =
  | { type: 'stabilize_all'; minStability: number }
  | { type: 'survive_years'; years: number }
  | { type: 'control_capital'; targetRegionId: string }

export type DefeatCondition =
  | { type: 'reputation_zero'; reputationId: string }
  | { type: 'capital_lost' }
  | { type: 'timeout'; years: number }

export type Scenario = {
  id: ScenarioId
  name: string
  description: string

  playerCountryId: CountryId
  playerRole: PlayerRole

  enabledFeatures: EnabledFeatures

  victoryCondition: VictoryCondition
  defeatConditions: DefeatCondition[]

  initialState: {
    treasury: number
    reputations: Reputation[]
    regionOverrides?: Record<
      string,
      Partial<{
        stability: number
        hiddenThreat: number
        intel: number
        happiness: number
        control: { ownerId: string; level: number }
      }>
    >
  }

  rngSeed?: number
}
