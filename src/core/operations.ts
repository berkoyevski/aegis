import rawOperations from '../data/operations/operations.json'
import type { Operation, OperationId } from './types'

export const ALL_OPERATIONS = rawOperations as Operation[]

const byId: Record<OperationId, Operation> = {}
for (const op of ALL_OPERATIONS) {
  byId[op.id] = op
}

export function getOperation(id: OperationId): Operation | undefined {
  return byId[id]
}
