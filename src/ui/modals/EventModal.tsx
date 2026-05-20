import type { EventChoice } from '../../core/types'
import { useGameStore } from '../../store/gameStore'

function choiceSummary(choice: EventChoice): string {
  const e = choice.effect
  const parts: string[] = []
  if (e.stabilityDelta) parts.push(`Stabilite ${fmt(e.stabilityDelta)}`)
  if (e.threatDelta) parts.push(`Tehdit ${fmt(e.threatDelta)}`)
  if (e.happinessDelta) parts.push(`Mutluluk ${fmt(e.happinessDelta)}`)
  if (e.intelDelta) parts.push(`İstihbarat ${fmt(e.intelDelta)}`)
  if (e.treasuryDelta) parts.push(`Hazine ${fmt(e.treasuryDelta)}`)
  for (const r of e.reputationDeltas ?? []) {
    parts.push(`${r.id === 'military' ? 'Asker' : 'Hükümet'} ${fmt(r.amount)}`)
  }
  return parts.join(' · ')
}

function fmt(n: number): string {
  return n > 0 ? `+${n}` : `${n}`
}

export function EventModal() {
  const event = useGameStore((s) => s.activeEvent)
  const dispatch = useGameStore((s) => s.dispatch)

  if (!event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-lg border border-red-500/40 bg-[var(--color-surface)] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-red-500/10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-red-400">
            Kriz
          </div>
          <div className="text-xl text-[var(--color-text)] mt-1">{event.title}</div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">
            {event.description}
          </p>

          <div className="flex flex-col gap-2">
            {event.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => dispatch({ type: 'RESOLVE_EVENT', choiceIndex: i })}
                className="text-left p-3 rounded-md border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[var(--color-text)] font-medium">
                    {choice.label}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]">
                    {choiceSummary(choice)}
                  </span>
                </div>
                {choice.description && (
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">
                    {choice.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
