import { useGameStore } from './store/gameStore'
import { DebugPanel } from './ui/panels/DebugPanel'

function App() {
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const regions = useGameStore((s) => s.regions)
  const player = useGameStore((s) => s.countries[s.playerCountryId])
  const selected = selectedRegionId ? regions[selectedRegionId] : null

  return (
    <div className="h-screen flex flex-col">
      <header className="px-6 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <div className="text-xl tracking-tight">AEGIS</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {player.name} &middot; vali
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
          Sprint 1 &middot; veri modeli aktif
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[1fr_420px] min-h-0 overflow-hidden">
        <section className="flex items-center justify-center p-10">
          <div className="text-center max-w-md">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-3">
              Harita Alanı
            </div>
            {selected ? (
              <>
                <div className="text-3xl font-light tracking-tight text-[var(--color-text)] mb-2">
                  {selected.name}
                </div>
                <div className="text-sm text-[var(--color-text-muted)] mb-6">
                  Nüfus: {selected.population.total.toLocaleString('tr-TR')} &middot; Mutluluk:{' '}
                  {selected.population.happiness}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] italic">
                  Sprint 2'de bu alan SVG harita olacak — şimdilik sağdaki panelden bölge seç.
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-light tracking-tight text-[var(--color-text)] mb-2">
                  {player.name}
                </div>
                <div className="text-sm text-[var(--color-text-muted)] mb-6">
                  {Object.keys(regions).length} bölge &middot; vali olarak göreve geldin
                </div>
                <div className="text-xs text-[var(--color-text-muted)] italic">
                  Sağdaki panelden bir bölge seç. Sprint 2'de bu alan canlı SVG harita olacak.
                </div>
              </>
            )}
          </div>
        </section>

        <DebugPanel />
      </main>
    </div>
  )
}

export default App
