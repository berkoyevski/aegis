import { useState } from 'react'
import { INSURGENT_FACTION } from '../../core/types'
import type { Region } from '../../core/types'
import { useGameStore } from '../../store/gameStore'
import { StatBar } from '../shared/StatBar'

function RegionRow({ region }: { region: Region }) {
  const dispatch = useGameStore((s) => s.dispatch)
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const capitalRegionId = useGameStore(
    (s) => s.countries[s.playerCountryId].capitalRegionId
  )

  const isSelected = region.id === selectedRegionId
  const isCapital = region.id === capitalRegionId
  const isInsurgent = region.control.ownerId === INSURGENT_FACTION
  const isStable = !isInsurgent && region.stability >= 70

  return (
    <button
      onClick={() =>
        dispatch({
          type: 'SELECT_REGION',
          regionId: isSelected ? null : region.id,
        })
      }
      className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors ${
        isSelected
          ? 'border-[var(--color-accent)] bg-[var(--color-surface-2)]'
          : 'border-transparent hover:bg-[var(--color-surface-2)]'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: isInsurgent
              ? 'var(--color-danger)'
              : isStable
                ? 'var(--color-success)'
                : 'var(--color-accent)',
          }}
        />
        <span className="text-sm text-[var(--color-text)] flex-1">
          {region.name}
        </span>
        {isCapital && (
          <span className="text-[9px] uppercase tracking-wider text-[var(--color-accent)]">
            başkent
          </span>
        )}
        {isInsurgent && (
          <span className="text-[9px] uppercase tracking-wider text-red-400">
            isyancı
          </span>
        )}
        {isStable && (
          <span className="text-[9px] uppercase tracking-wider text-[var(--color-success)]">
            stabil
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 pl-4">
        <StatBar label="Stabilite" value={region.stability} tone="positive" />
        <StatBar label="Gizli Tehdit" value={region.hiddenThreat} tone="negative" />
      </div>
    </button>
  )
}

export function OverviewPanel() {
  const [showDev, setShowDev] = useState(false)

  const scenarioName = useGameStore((s) => s.scenarioName)
  const player = useGameStore((s) => s.countries[s.playerCountryId])
  const playerCountryId = useGameStore((s) => s.playerCountryId)
  const regionsMap = useGameStore((s) => s.regions)
  const reset = useGameStore((s) => s.reset)
  const gameTime = useGameStore((s) => s.gameTime)
  const status = useGameStore((s) => s.status)
  const rngSeed = useGameStore((s) => s.rngSeed)

  const regions = Object.values(regionsMap)
  const owned = regions.filter((r) => r.control.ownerId === playerCountryId)
  const stabilized = owned.filter((r) => r.stability >= 70).length
  const progressPct = (stabilized / regions.length) * 100

  return (
    <aside className="border-l border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col min-h-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Görev
        </div>
        <div className="mt-1 text-base text-[var(--color-text)]">
          {scenarioName}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {player.reputations.map((r) => (
            <StatBar key={r.id} label={r.label} value={r.value} tone="positive" />
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[var(--color-text-muted)]">Stabilize bölgeler</span>
          <span className="font-mono text-[var(--color-text)]">
            {stabilized}/{regions.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
          Tüm bölgeleri stabilize et (≥70) → zafer
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Bölgeler
        </div>
        <div className="flex flex-col gap-0.5">
          {regions.map((r) => (
            <RegionRow key={r.id} region={r} />
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <button
          onClick={reset}
          className="text-xs text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
        >
          Yeniden başlat
        </button>
        <button
          onClick={() => setShowDev((v) => !v)}
          className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          {showDev ? 'dev gizle' : 'dev'}
        </button>
      </div>

      {showDev && (
        <pre className="text-[9px] font-mono p-3 bg-[var(--color-bg)] border-t border-[var(--color-border)] overflow-auto max-h-64 text-[var(--color-text-muted)]">
          {JSON.stringify(
            { gameTime, status, rngSeed, regions: regionsMap },
            null,
            2
          )}
        </pre>
      )}
    </aside>
  )
}
