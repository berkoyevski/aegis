import type { InitiativeId, OperationId, RegionId, ScenarioId } from './ids'
import type { GameSpeed } from './state'

export type Action =
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_SPEED'; speed: GameSpeed }
  | { type: 'SELECT_REGION'; regionId: RegionId | null }
  | { type: 'ACTIVATE_INITIATIVE'; regionId: RegionId; initiativeId: InitiativeId }
  | { type: 'DEACTIVATE_INITIATIVE'; regionId: RegionId; initiativeId: InitiativeId }
  | { type: 'EXECUTE_OPERATION'; operationId: OperationId; targetRegionId?: RegionId }
  | { type: 'RESET'; scenarioId: ScenarioId }
