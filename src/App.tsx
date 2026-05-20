import { useGameStore } from './store/gameStore'
import { useGameLoop } from './ui/hooks/useGameLoop'
import { MapView } from './ui/map/MapView'
import { DebugPanel } from './ui/panels/DebugPanel'
import { TopBar } from './ui/panels/TopBar'

function App() {
  const player = useGameStore((s) => s.countries[s.playerCountryId])

  useGameLoop()

  return (
    <div className="h-screen flex flex-col">
      <header className="px-6 py-3 border-b border-[var(--color-border)] flex items-center justify-between gap-6">
        <div className="flex items-baseline gap-4 shrink-0">
          <div className="text-xl tracking-tight">AEGIS</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {player.name} &middot; vali
          </div>
        </div>
        <TopBar />
      </header>

      <main className="flex-1 grid grid-cols-[1fr_420px] min-h-0 overflow-hidden">
        <MapView />
        <DebugPanel />
      </main>
    </div>
  )
}

export default App
