import { useEffect } from 'react'
import type { GameSpeed } from '../../core/types'
import { useGameStore } from '../../store/gameStore'

const SPEED_MS: Record<GameSpeed, number> = {
  1: 1000,
  2: 500,
  5: 200,
}

export function useGameLoop() {
  const paused = useGameStore((s) => s.paused)
  const speed = useGameStore((s) => s.speed)
  const status = useGameStore((s) => s.status)
  const dispatch = useGameStore((s) => s.dispatch)

  useEffect(() => {
    if (paused || status !== 'playing') return

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, SPEED_MS[speed])

    return () => clearInterval(interval)
  }, [paused, speed, status, dispatch])
}
