import { useGameStore } from '../../store/gameStore'
import { RegionPolygon } from './RegionPolygon'

export function MapView() {
  const regions = useGameStore((s) => s.regions)
  const dispatch = useGameStore((s) => s.dispatch)

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden">
      <svg
        viewBox="-120 -90 1040 580"
        className="w-full h-full max-w-full max-h-full"
        onClick={() => dispatch({ type: 'SELECT_REGION', regionId: null })}
      >
        <defs>
          <radialGradient id="sea" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="hsl(202, 42%, 13%)" />
            <stop offset="100%" stopColor="hsl(210, 50%, 6%)" />
          </radialGradient>
          <pattern
            id="waves"
            width="46"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(0)"
          >
            <path
              d="M0 10 Q 11.5 4, 23 10 T 46 10"
              fill="none"
              stroke="hsl(195, 50%, 30%)"
              strokeWidth="1"
              opacity="0.10"
            />
          </pattern>
          <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="coast" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor="hsl(195, 60%, 45%)"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <rect x="-120" y="-90" width="1040" height="580" fill="url(#sea)" />
        <rect x="-120" y="-90" width="1040" height="580" fill="url(#waves)" />

        <g filter="url(#coast)">
          {Object.values(regions).map((r) => (
            <polygon
              key={`${r.id}-land`}
              points={r.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="hsl(210, 22%, 9%)"
            />
          ))}
        </g>

        <g>
          {Object.values(regions).map((r) => (
            <RegionPolygon key={r.id} region={r} />
          ))}
        </g>
      </svg>
    </div>
  )
}
