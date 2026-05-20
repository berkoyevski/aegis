import rawInitiatives from '../data/initiatives/initiatives.json'
import type { Initiative, InitiativeBranch, InitiativeId } from './types'

export const ALL_INITIATIVES = rawInitiatives as Initiative[]

const byId: Record<InitiativeId, Initiative> = {}
for (const init of ALL_INITIATIVES) {
  byId[init.id] = init
}

export function getInitiative(id: InitiativeId): Initiative | undefined {
  return byId[id]
}

export const BRANCHES: InitiativeBranch[] = ['governance', 'security', 'economy']

export const BRANCH_LABELS: Record<InitiativeBranch, string> = {
  governance: 'Yönetim',
  security: 'Güvenlik',
  economy: 'Ekonomi',
}

export function initiativesByBranch(branch: InitiativeBranch): Initiative[] {
  return ALL_INITIATIVES.filter((i) => i.branch === branch).sort(
    (a, b) => a.tier - b.tier
  )
}
