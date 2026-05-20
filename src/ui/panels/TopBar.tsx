import { computeIncome } from '../../core/systems/economy'
import type { GameSpeed } from '../../core/types'
import { useGameStore } from '../../store/gameStore'

const SPEEDS: GameSpeed[] = [1, 2, 5]

export function TopBar() {
  const gameTime = useGameStore((s) => s.gameTime)
  const paused = useGameStore((s) => s.paused)
  const speed = useGameStore((s) => s.speed)
  const dispatch = useGameStore((s) => s.dispatch)
  const player = useGameStore((s) => s.countries[s.playerCountryId])
  const income = useGameStore((s) => computeIncome(s, s.playerCountryId))

  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Gün
        </span>
        <span className="font-mono text-base text-[var(--color-text)]">{gameTime}</span>
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Hazine
        </span>
        <span className="font-mono text-base text-[var(--color-accent)]">
          ₳ {player.treasury.toLocaleString('tr-TR')}
          <span className="ml-1 text-xs text-[var(--color-success)]">
            +{income}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch({ type: paused ? 'RESUME' : 'PAUSE' })}
          className="px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors text-sm w-10"
          title={paused ? 'Devam et' : 'Duraklat'}
        >
          {paused ? '▶' : '⏸'}
        </button>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => dispatch({ type: 'SET_SPEED', speed: s })}
            className={`px-2.5 py-1.5 rounded-md border text-sm transition-colors ${
              speed === s
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
