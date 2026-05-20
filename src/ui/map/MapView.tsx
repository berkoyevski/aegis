import { useGameStore } from '../../store/gameStore'
import { MapDecorations, MapWater } from './MapDecor'
import { RegionMarker, RegionShape } from './RegionPolygon'

export function MapView() {
  const regions = useGameStore((s) => s.regions)
  const dispatch = useGameStore((s) => s.dispatch)
  const viewBox = useGameStore((s) => s.mapViewBox)
  const lakes = useGameStore((s) => s.mapLakes)
  const rivers = useGameStore((s) => s.mapRivers)

  const [vx, vy, vw, vh] = viewBox.split(' ').map(Number)
  const list = Object.values(regions)
  const decorations = list.flatMap((r) => r.decorations ?? [])

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden">
      <svg
        viewBox={viewBox}
        className="w-full h-full max-w-full max-h-full"
        onClick={() => dispatch({ type: 'SELECT_REGION', regionId: null })}
      >
        <defs>
          <radialGradient id="sea" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="hsl(202, 42%, 13%)" />
            <stop offset="100%" stopColor="hsl(210, 50%, 6%)" />
          </radialGradient>
          <pattern id="waves" width="46" height="20" patternUnits="userSpaceOnUse">
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

        <rect x={vx} y={vy} width={vw} height={vh} fill="url(#sea)" />
        <rect x={vx} y={vy} width={vw} height={vh} fill="url(#waves)" />

        {/* contiguous landmass + coast glow */}
        <g filter="url(#coast)">
          {list.map((r) => (
            <path key={`${r.id}-land`} d={r.path} fill="hsl(210, 22%, 9%)" />
          ))}
        </g>

        {/* region fills (clickable) */}
        <g>
          {list.map((r) => (
            <RegionShape key={r.id} region={r} />
          ))}
        </g>

        {/* water: rivers + lakes */}
        <MapWater lakes={lakes} rivers={rivers} />

        {/* terrain decorations */}
        <MapDecorations decorations={decorations} />

        {/* labels + city/threat markers (top) */}
        <g>
          {list.map((r) => (
            <RegionMarker key={r.id} region={r} />
          ))}
        </g>
      </svg>
    </div>
  )
}
