import type { Region } from '../../core/types'
import { INSURGENT_FACTION } from '../../core/types'
import { useGameStore } from '../../store/gameStore'
import { CapitalMarker, CityMarker, ThreatMarker } from './MapMarkers'
import { regionColor } from './regionColor'

export function RegionShape({ region }: { region: Region }) {
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const dispatch = useGameStore((s) => s.dispatch)
  const playerCountryId = useGameStore((s) => s.playerCountryId)

  const isSelected = region.id === selectedRegionId
  const { fill, fillDark, stroke } = regionColor(region, playerCountryId)
  const gradId = `grad-${region.id}`

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
        d={region.path}
        fill={`url(#${gradId})`}
        stroke={isSelected ? 'var(--color-accent)' : stroke}
        strokeWidth={isSelected ? 3 : 1.2}
        strokeLinejoin="round"
        filter={isSelected ? 'url(#region-glow)' : undefined}
        className="transition-[stroke,stroke-width,opacity] duration-150 group-hover:opacity-95 group-hover:[stroke:var(--color-text)]"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  )
}

export function RegionMarker({ region }: { region: Region }) {
  const playerCountryId = useGameStore((s) => s.playerCountryId)
  const capitalRegionId = useGameStore(
    (s) => s.countries[s.playerCountryId].capitalRegionId
  )

  const isCapital = region.id === capitalRegionId
  const isInsurgent = region.control.ownerId === INSURGENT_FACTION
  const showThreat = isInsurgent || region.hiddenThreat >= 55
  const { text } = regionColor(region, playerCountryId)
  const cx = region.labelX
  const cy = region.labelY

  return (
    <g className="pointer-events-none select-none">
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
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.35)', strokeWidth: 3.5 }}
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
        opacity={0.8}
        className="uppercase tracking-wider"
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.3)', strokeWidth: 3 }}
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
