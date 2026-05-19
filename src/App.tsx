import { useUiStore } from './store/uiStore'

function App() {
  const bootCounter = useUiStore((s) => s.bootCounter)
  const incrementBoot = useUiStore((s) => s.incrementBoot)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
        Sprint 0 · Boot
      </div>
      <h1 className="text-7xl font-light tracking-tight text-[var(--color-text)]">
        AEGIS
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)] max-w-md">
        Bir grand strategy sandbox &mdash; çekirdek motor inşa halinde.
      </p>

      <div className="mt-10 flex items-center gap-3">
        <button
          onClick={incrementBoot}
          className="px-5 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          Sistem testi
        </button>
        <span className="text-sm text-[var(--color-text-muted)]">
          tick:{' '}
          <span className="font-mono text-[var(--color-accent)]">
            {bootCounter}
          </span>
        </span>
      </div>

      <div className="mt-12 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
        <span>Vite · React · TS · Tailwind v4 · Zustand</span>
      </div>
    </div>
  )
}

export default App
