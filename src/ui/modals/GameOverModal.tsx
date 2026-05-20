import { useGameStore } from '../../store/gameStore'

export function GameOverModal() {
  const status = useGameStore((s) => s.status)
  const gameTime = useGameStore((s) => s.gameTime)
  const reset = useGameStore((s) => s.reset)

  if (status === 'playing') return null

  const isVictory = status === 'victory'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={`w-full max-w-md mx-4 rounded-lg border bg-[var(--color-surface)] shadow-2xl overflow-hidden ${
          isVictory ? 'border-[var(--color-success)]/50' : 'border-red-500/50'
        }`}
      >
        <div
          className={`px-6 py-8 text-center ${
            isVictory ? 'bg-[var(--color-success)]/10' : 'bg-red-500/10'
          }`}
        >
          <div
            className={`text-[10px] uppercase tracking-[0.4em] ${
              isVictory ? 'text-[var(--color-success)]' : 'text-red-400'
            }`}
          >
            {isVictory ? 'Görev Tamamlandı' : 'Görev Başarısız'}
          </div>
          <div className="text-4xl font-light tracking-tight text-[var(--color-text)] mt-3">
            {isVictory ? 'ZAFER' : 'YENİLGİ'}
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-4 leading-relaxed">
            {isVictory
              ? `${gameTime}. günde Karastan'ın tüm bölgelerini stabilize ettin. Düzen yeniden kuruldu.`
              : `${gameTime}. günde kontrolü kaybettin. Karastan kaosa sürüklendi.`}
          </p>
        </div>

        <div className="px-6 py-5">
          <button
            onClick={reset}
            className="w-full px-4 py-3 rounded-md border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors text-sm"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    </div>
  )
}
