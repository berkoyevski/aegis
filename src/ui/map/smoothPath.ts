import type { Coordinate } from '../../core/types'

export function smoothClosedPath(pts: Coordinate[], k = 0.32): string {
  const n = pts.length
  if (n < 3) {
    return (
      pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ') + ' Z'
    )
  }

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]

    const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * k
    const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * k
    const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * k
    const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * k

    d += `C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `
  }
  return d + 'Z'
}
