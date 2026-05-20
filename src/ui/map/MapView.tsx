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
        <defs>
          <pattern
            id="map-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0 L0 0 0 32"
              fill="none"
              stroke="rgba(120,140,170,0.06)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="map-vignette" cx="50%" cy="45%" r="75%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
          <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="-10" y="-10" width="820" height="420" fill="var(--color-bg)" />
        <rect x="-10" y="-10" width="820" height="420" fill="url(#map-grid)" />

        {Object.values(regions).map((r) => (
          <RegionPolygon key={r.id} region={r} />
        ))}

        <rect
          x="-10"
          y="-10"
          width="820"
          height="420"
          fill="url(#map-vignette)"
          className="pointer-events-none"
        />
      </svg>
    </div>
  )
}
