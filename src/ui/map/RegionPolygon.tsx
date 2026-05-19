import type { Region } from '../../core/types'
import { INSURGENT_FACTION } from '../../core/types'
import { useGameStore } from '../../store/gameStore'
import { regionColor } from './regionColor'

type Props = {
  region: Region
}

export function RegionPolygon({ region }: Props) {
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const dispatch = useGameStore((s) => s.dispatch)
  const playerCountryId = useGameStore((s) => s.playerCountryId)
  const player = useGameStore((s) => s.countries[s.playerCountryId])

  const isSelected = region.id === selectedRegionId
  const isCapital = region.id === player.capitalRegionId
  const isInsurgent = region.control.ownerId === INSURGENT_FACTION

  const { fill, stroke, text } = regionColor(region, playerCountryId)

  const points = region.polygon.map(([x, y]) => `${x},${y}`).join(' ')

  const cx =
    region.polygon.reduce((s, [x]) => s + x, 0) / region.polygon.length
  const cy =
    region.polygon.reduce((s, [, y]) => s + y, 0) / region.polygon.length

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
      <polygon
        points={points}
        fill={fill}
        stroke={isSelected ? 'var(--color-accent)' : stroke}
        strokeWidth={isSelected ? 3 : 1.2}
        className="transition-[stroke,stroke-width,opacity] duration-150 group-hover:opacity-90"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize="14"
        fontWeight={500}
        className="pointer-events-none select-none"
      >
        {region.name}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize="9"
        opacity={0.7}
        className="pointer-events-none select-none uppercase tracking-wider"
      >
        {isInsurgent
          ? 'isyancı'
          : isCapital
          ? 'başkent'
          : `stab ${region.stability}`}
      </text>
    </g>
  )
}
