import type { EventEffect } from './events'
import type { OperationId } from './ids'

export type Operation = {
  id: OperationId
  name: string
  description: string
  cost: number
  cooldown: number
  effect: EventEffect
}
