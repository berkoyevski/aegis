import {
  BRANCH_LABELS,
  BRANCHES,
  initiativesByBranch,
} from '../../core/initiatives'
import { ALL_OPERATIONS } from '../../core/operations'
import type { Initiative, Operation, Region } from '../../core/types'
import { useGameStore } from '../../store/gameStore'

function OperationButton({ op, region }: { op: Operation; region: Region }) {
  const dispatch = useGameStore((s) => s.dispatch)
  const treasury = useGameStore((s) => s.countries[s.playerCountryId].treasury)
  const gameTime = useGameStore((s) => s.gameTime)
  const availableAt = useGameStore((s) => s.operationCooldowns[op.id] ?? 0)

  const remaining = Math.max(0, availableAt - gameTime)
  const onCooldown = remaining > 0
  const canAfford = treasury >= op.cost
  const disabled = onCooldown || !canAfford

  let label: string
  if (onCooldown) label = `${remaining} gün`
  else label = `${op.name} · ₳${op.cost}`

  return (
    <button
      disabled={disabled}
      title={op.description}
      onClick={() =>
        dispatch({
          type: 'EXECUTE_OPERATION',
          operationId: op.id,
          targetRegionId: region.id,
        })
      }
      className={`text-xs px-2.5 py-1.5 rounded-md border whitespace-nowrap transition-colors ${
        disabled
          ? 'border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
          : 'border-sky-500/50 text-sky-300 hover:bg-sky-500/10'
      }`}
    >
      {label}
    </button>
  )
}

function OperationsRow({ region }: { region: Region }) {
  return (
    <div className="px-4 py-3 border-b border-[var(--color-border)]">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        Operasyonlar (anlık)
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_OPERATIONS.map((op) => (
          <OperationButton key={op.id} op={op} region={region} />
        ))}
      </div>
    </div>
  )
}

function effectSummary(init: Initiative): string {
  const e = init.effects
  const parts: string[] = []
  if (e.stabilityBonus) parts.push(`Stabilite +${e.stabilityBonus}`)
  if (e.happinessBonus) parts.push(`Mutluluk +${e.happinessBonus}`)
  if (e.intelBonus) parts.push(`İstihbarat +${e.intelBonus}`)
  if (e.threatReduction) parts.push(`Tehdit −${e.threatReduction}`)
  if (e.incomeBonus) parts.push(`Gelir +${e.incomeBonus}`)
  if (init.upkeep) parts.push(`Gider −${init.upkeep}/gün`)
  return parts.join(' · ')
}

function InitiativeCard({ init, region }: { init: Initiative; region: Region }) {
  const dispatch = useGameStore((s) => s.dispatch)
  const treasury = useGameStore((s) => s.countries[s.playerCountryId].treasury)

  const isActive = region.activeInitiatives.includes(init.id)
  const reqsMet = init.requires.every((r) => region.activeInitiatives.includes(r))
  const canAfford = treasury >= init.cost

  const missingReq = init.requires.find(
    (r) => !region.activeInitiatives.includes(r)
  )

  let buttonLabel: string
  let disabled = false
  if (isActive) {
    buttonLabel = '✓ Aktif'
  } else if (!reqsMet) {
    buttonLabel = 'Kilitli'
    disabled = true
  } else if (!canAfford) {
    buttonLabel = `₳${init.cost}`
    disabled = true
  } else {
    buttonLabel = `Kur · ₳${init.cost}`
  }

  return (
    <div
      className={`p-2.5 rounded-md border text-xs ${
        isActive
          ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/5'
          : 'border-[var(--color-border)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[var(--color-text)] font-medium">{init.name}</span>
        {isActive ? (
          <button
            onClick={() =>
              dispatch({
                type: 'DEACTIVATE_INITIATIVE',
                regionId: region.id,
                initiativeId: init.id,
              })
            }
            className="text-[10px] px-2 py-1 rounded border border-[var(--color-success)]/50 text-[var(--color-success)] hover:border-red-500 hover:text-red-400 transition-colors"
          >
            {buttonLabel}
          </button>
        ) : (
          <button
            disabled={disabled}
            onClick={() =>
              dispatch({
                type: 'ACTIVATE_INITIATIVE',
                regionId: region.id,
                initiativeId: init.id,
              })
            }
            className={`text-[10px] px-2 py-1 rounded border transition-colors whitespace-nowrap ${
              disabled
                ? 'border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
                : 'border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10'
            }`}
          >
            {buttonLabel}
          </button>
        )}
      </div>
      <div className="text-[var(--color-text-muted)] leading-relaxed">
        {effectSummary(init)}
      </div>
      {!reqsMet && missingReq && (
        <div className="text-[10px] text-amber-500/80 mt-1">
          Önce gerekli: {missingReq}
        </div>
      )}
    </div>
  )
}

export function InitiativePanel() {
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const region = useGameStore((s) =>
    s.selectedRegionId ? s.regions[s.selectedRegionId] : null
  )

  if (!selectedRegionId || !region) {
    return (
      <div className="border-t border-[var(--color-border)] px-5 py-4 text-xs text-[var(--color-text-muted)] text-center">
        Girişim kurmak için haritadan bir bölge seç.
      </div>
    )
  }

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] overflow-y-auto max-h-[40vh]">
      <div className="px-5 py-3 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)]">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Girişimler
        </span>
        <span className="ml-2 text-sm text-[var(--color-text)]">{region.name}</span>
      </div>

      <OperationsRow region={region} />

      <div className="p-4 grid grid-cols-3 gap-4">
        {BRANCHES.map((branch) => (
          <div key={branch} className="flex flex-col gap-2">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              {BRANCH_LABELS[branch]}
            </div>
            {initiativesByBranch(branch).map((init) => (
              <InitiativeCard key={init.id} init={init} region={region} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
