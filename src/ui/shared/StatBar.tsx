type StatBarProps = {
  label: string
  value: number
  max?: number
  tone?: 'positive' | 'negative' | 'neutral'
}

function toneClasses(tone: StatBarProps['tone'], value: number, max: number) {
  if (tone === 'negative') {
    if (value / max > 0.6) return 'bg-red-500'
    if (value / max > 0.3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }
  if (tone === 'neutral') return 'bg-sky-500'
  if (value / max > 0.6) return 'bg-emerald-500'
  if (value / max > 0.3) return 'bg-amber-500'
  return 'bg-red-500'
}

export function StatBar({ label, value, max = 100, tone = 'positive' }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const barColor = toneClasses(tone, value, max)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
        <span>{label}</span>
        <span className="font-mono text-[var(--color-text)]">
          {value.toFixed(0)}
          <span className="text-[var(--color-text-muted)]">/{max}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-200`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
