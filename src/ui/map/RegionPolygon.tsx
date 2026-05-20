import type { Region } from '../../core/types'
import { INSURGENT_FACTION } from '../../core/types'
import { useGameStore } from '../../store/gameStore'
import { CapitalMarker, CityMarker, ThreatMarker } from './MapMarkers'
import { regionColor } from './regionColor'

type Props = {
  region: Region
}

export function RegionPolygon({ region }: Props) {
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const dispatch = useGameStore((s) => s.dispatch)
  const playerCountryId = useGameStore((s) => s.playerCountryId)
  const capitalRegionId = useGameStore(
    (s) => s.countries[s.playerCountryId].capitalRegionId
  )

  const isSelected = region.id === selectedRegionId
  const isCapital = region.id === capitalRegionId
  const isInsurgent = region.control.ownerId === INSURGENT_FACTION
  const showThreat = isInsurgent || region.hiddenThreat >= 55

  const { fill, fillDark, stroke, text } = regionColor(region, playerCountryId)
  const gradId = `grad-${region.id}`

  const pathD = region.path
  const cx = region.labelX
  const cy = region.labelY

  return (
    <g
      className="cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation()
        dispatch({
          type: 'SELECT_REGION',
          regionId: isSelected ? null : region.id,
        })
      }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="38%" r="78%">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor={fillDark} />
        </radialGradient>
      </defs>

      <path
        d={pathD}
        fill={`url(#${gradId})`}
        stroke={isSelected ? 'var(--color-accent)' : stroke}
        strokeWidth={isSelected ? 3 : 1.2}
        strokeLinejoin="round"
        filter={isSelected ? 'url(#region-glow)' : undefined}
        className="transition-[stroke,stroke-width,opacity] duration-150 group-hover:opacity-95 group-hover:[stroke:var(--color-text)]"
        vectorEffect="non-scaling-stroke"
      />

      {isCapital ? (
        <CapitalMarker x={cx} y={cy - 26} color={text} />
      ) : (
        <CityMarker x={cx} y={cy - 26} color={text} />
      )}

      {showThreat && <ThreatMarker x={cx + 38} y={cy - 22} />}

      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize="15"
        fontWeight={600}
        className="pointer-events-none select-none"
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.25)', strokeWidth: 3 }}
      >
        {region.name}
      </text>
      <text
        x={cx}
        y={cy + 23}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize="9"
        opacity={0.75}
        className="pointer-events-none select-none uppercase tracking-wider"
      >
        {isInsurgent
          ? 'isyancı'
          : isCapital
            ? 'başkent'
            : `stab ${Math.round(region.stability)}`}
      </text>
    </g>
  )
}
