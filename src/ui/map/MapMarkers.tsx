type MarkerProps = {
  x: number
  y: number
  color: string
}

export function CityMarker({ x, y, color }: MarkerProps) {
  return (
    <g
      transform={`translate(${x - 11}, ${y - 12})`}
      opacity={0.85}
      className="pointer-events-none"
    >
      <rect x={0} y={9} width={5} height={9} fill={color} />
      <rect x={6} y={3} width={6} height={15} fill={color} />
      <rect x={13} y={11} width={5} height={7} fill={color} />
      <rect x={19} y={6} width={4} height={12} fill={color} />
    </g>
  )
}

export function CapitalMarker({ x, y, color }: MarkerProps) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={0.95}
      className="pointer-events-none"
    >
      <rect x={-13} y={-2} width={26} height={14} fill={color} />
      <rect x={-13} y={-8} width={5} height={6} fill={color} />
      <rect x={-3} y={-8} width={6} height={6} fill={color} />
      <rect x={8} y={-8} width={5} height={6} fill={color} />
      <rect x={-1.2} y={-22} width={1.5} height={14} fill={color} />
      <path d="M0,-22 L10,-19 L0,-16 Z" fill="var(--color-accent)" />
    </g>
  )
}

export function ThreatMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
      <path
        d="M0,-9 L9,7 L-9,7 Z"
        fill="rgba(220,38,38,0.92)"
        stroke="rgba(255,180,180,0.7)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <rect x={-1} y={-4} width={2} height={6} fill="white" />
      <rect x={-1} y={3.5} width={2} height={2} fill="white" />
    </g>
  )
}
