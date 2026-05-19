import { INSURGENT_FACTION } from '../../core/types'
import type { CountryId, Region } from '../../core/types'

export type RegionColors = {
  fill: string
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
    baseLightness = 32
  } else if (isPlayer) {
    hue = 40 + (region.stability / 100) * 130
    baseLightness = 26 + (region.stability / 100) * 10
  } else {
    hue = 220
    baseLightness = 22
  }

  const saturation = 28 + (region.control.level / 100) * 28

  return {
    fill: `hsl(${hue}, ${saturation}%, ${baseLightness}%)`,
    stroke: `hsl(${hue}, ${saturation + 12}%, ${baseLightness + 18}%)`,
    text: baseLightness < 35 ? 'rgba(245,245,250,0.95)' : 'rgba(20,20,28,0.9)',
  }
}
