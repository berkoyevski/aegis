import { useGameStore } from '../../store/gameStore'
import { RegionPolygon } from './RegionPolygon'

export function MapView() {
  const regions = useGameStore((s) => s.regions)
  const dispatch = useGameStore((s) => s.dispatch)

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden">
      <svg
        viewBox="-10 -10 820 420"
        className="w-full h-full max-w-full max-h-full"
        onClick={() => dispatch({ type: 'SELECT_REGION', regionId: null })}
      >
        <rect
          x="-10"
          y="-10"
          width="820"
          height="420"
          fill="var(--color-bg)"
        />

        {Object.values(regions).map((r) => (
          <RegionPolygon key={r.id} region={r} />
        ))}
      </svg>
    </div>
  )
}
