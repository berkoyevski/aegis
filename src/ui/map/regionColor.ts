import { INSURGENT_FACTION } from '../../core/types'
import type { CountryId, Region } from '../../core/types'

export type RegionColors = {
  fill: string
  fillDark: string
  stroke: string
  text: string
}

export function regionColor(
  region: Region,
  playerCountryId: CountryId
): RegionColors {
  const isInsurgent = region.control.ownerId === INSURGENT_FACTION
  const isPlayer = region.control.ownerId === playerCountryId

  let hue: number
  let baseLightness: number

  if (isInsurgent) {
    hue = 358
    baseLightness = 30
  } else if (isPlayer) {
    hue = 40 + (region.stability / 100) * 130
    baseLightness = 24 + (region.stability / 100) * 12
  } else {
    hue = 220
    baseLightness = 22
  }

  const saturation = 30 + (region.control.level / 100) * 28

  return {
    fill: `hsl(${hue}, ${saturation}%, ${baseLightness + 7}%)`,
    fillDark: `hsl(${hue}, ${saturation + 6}%, ${Math.max(8, baseLightness - 10)}%)`,
    stroke: `hsl(${hue}, ${saturation + 14}%, ${baseLightness + 22}%)`,
    text: baseLightness < 34 ? 'rgba(246,247,252,0.96)' : 'rgba(18,20,26,0.92)',
  }
}
