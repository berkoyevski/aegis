import { useGameStore } from './store/gameStore'
import { MapView } from './ui/map/MapView'
import { DebugPanel } from './ui/panels/DebugPanel'

function App() {
  const player = useGameStore((s) => s.countries[s.playerCountryId])

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
          Sprint 2 &middot; harita aktif
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[1fr_420px] min-h-0 overflow-hidden">
        <MapView />
        <DebugPanel />
      </main>
    </div>
  )
}

export default App
