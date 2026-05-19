import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { StatBar } from '../shared/StatBar'

export function DebugPanel() {
  const [showRaw, setShowRaw] = useState(false)

  const state = useGameStore()
  const player = state.countries[state.playerCountryId]
  const regions = Object.values(state.regions)
  const selectedRegion = state.selectedRegionId ? state.regions[state.selectedRegionId] : null

  return (
    <aside className="border-l border-[var(--color-border)] bg-[var(--color-surface)] overflow-y-auto">
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Senaryo
        </div>
        <div className="mt-1 text-lg text-[var(--color-text)]">{state.scenarioId}</div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[var(--color-text-muted)]">Gün</div>
            <div className="font-mono text-base text-[var(--color-text)]">
              {state.gameTime}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-text-muted)]">Durum</div>
            <div className="text-base text-[var(--color-text)]">
              {state.paused ? 'Duraklatıldı' : `${state.speed}x`}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-text-muted)]">Hazine</div>
            <div className="font-mono text-base text-[var(--color-accent)]">
              ₳ {player.treasury.toLocaleString('tr-TR')}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-text-muted)]">Oyun</div>
            <div className="text-base text-[var(--color-text)]">{state.status}</div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
          Reputation
        </div>
        <div className="flex flex-col gap-3">
          {player.reputations.map((r) => (
            <StatBar key={r.id} label={r.label} value={r.value} tone="positive" />
          ))}
        </div>
      </div>

      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Bölgeler ({regions.length})
          </div>
          {selectedRegion && (
            <button
              onClick={() => state.dispatch({ type: 'SELECT_REGION', regionId: null })}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              seçimi temizle
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {regions.map((r) => {
            const isSelected = r.id === state.selectedRegionId
            const isCapital = r.id === player.capitalRegionId
            const isInsurgent = r.control.ownerId === 'insurgent'

            return (
              <button
                key={r.id}
                onClick={() =>
                  state.dispatch({
                    type: 'SELECT_REGION',
                    regionId: isSelected ? null : r.id,
                  })
                }
                className={`text-left p-3 rounded-md border transition-colors ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-2)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text)]">{r.name}</span>
                    {isCapital && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
                        başkent
                      </span>
                    )}
                    {isInsurgent && (
                      <span className="text-[10px] uppercase tracking-wider text-red-400">
                        isyancı
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">
                    {(r.population.total / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <StatBar label="Stabilite" value={r.stability} tone="positive" />
                  <StatBar label="Gizli Tehdit" value={r.hiddenThreat} tone="negative" />
                  <StatBar label="İstihbarat" value={r.intel} tone="neutral" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <button
          onClick={() => state.reset()}
          className="text-sm px-3 py-2 rounded-md border border-[var(--color-border)] hover:border-red-500 hover:text-red-400 transition-colors"
        >
          Senaryoyu Sıfırla
        </button>
        <button
          onClick={() => setShowRaw((v) => !v)}
          className="text-sm px-3 py-2 rounded-md border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors"
        >
          {showRaw ? 'Ham JSON gizle' : 'Ham JSON göster'}
        </button>
        {showRaw && (
          <pre className="text-[10px] font-mono p-3 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] overflow-auto max-h-96 text-[var(--color-text-muted)]">
            {JSON.stringify(
              {
                gameTime: state.gameTime,
                paused: state.paused,
                speed: state.speed,
                status: state.status,
                scenarioId: state.scenarioId,
                playerCountryId: state.playerCountryId,
                selectedRegionId: state.selectedRegionId,
                rngSeed: state.rngSeed,
                countries: state.countries,
                regions: state.regions,
              },
              null,
              2
            )}
          </pre>
        )}
      </div>
    </aside>
  )
}
