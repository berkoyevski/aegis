type Water = { name: string; path: string }

export function MapWater({
  lakes,
  rivers,
}: {
  lakes: Water[]
  rivers: Water[]
}) {
  return (
    <g className="pointer-events-none">
      {rivers.map((r) => (
        <path
          key={r.name}
          d={r.path}
          fill="none"
          stroke="hsl(199, 70%, 52%)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
      ))}
      {lakes.map((l) => (
        <path
          key={l.name}
          d={l.path}
          fill="hsl(200, 65%, 42%)"
          stroke="hsl(195, 70%, 60%)"
          strokeWidth={1}
          opacity={0.92}
        />
      ))}
    </g>
  )
}

type Deco = { x: number; y: number; kind: string }

function Glyph({ kind }: { kind: string }) {
  switch (kind) {
    case 'mountain':
      return (
        <g opacity={0.55}>
          <path d="M-9,5 L-3,-6 L1,0 L5,-9 L11,5 Z" fill="#7d6e5c" />
          <path d="M-3,-6 L-1,-3 L1,0 Z" fill="#cdb8a0" />
          <path d="M5,-9 L7,-5 L9,-1.5 Z" fill="#cdb8a0" />
        </g>
      )
    case 'tree':
      return (
        <g opacity={0.6}>
          <rect x={-1} y={2} width={2} height={4} fill="#5a4327" />
          <path d="M0,-8 L5,2 L-5,2 Z" fill="#2f6b3a" />
          <path d="M0,-4 L4,4 L-4,4 Z" fill="#357a44" />
        </g>
      )
    case 'wheat':
      return (
        <g opacity={0.5} stroke="#c9a93f" strokeWidth={1.4} strokeLinecap="round">
          <line x1={-4} y1={5} x2={-4} y2={-4} />
          <line x1={0} y1={5} x2={0} y2={-6} />
          <line x1={4} y1={5} x2={4} y2={-4} />
        </g>
      )
    case 'wave':
      return (
        <path
          d="M-7,0 Q -3.5,-4 0,0 T 7,0"
          fill="none"
          stroke="hsl(199,60%,60%)"
          strokeWidth={1.4}
          opacity={0.5}
        />
      )
    case 'building':
      return (
        <g opacity={0.5} fill="#9aa3b0">
          <rect x={-6} y={-2} width={4} height={8} />
          <rect x={-1} y={-6} width={4} height={12} />
          <rect x={4} y={0} width={4} height={6} />
        </g>
      )
    default:
      return null
  }
}

export function MapDecorations({ decorations }: { decorations: Deco[] }) {
  return (
    <g className="pointer-events-none">
      {decorations.map((d, i) => (
        <g key={i} transform={`translate(${d.x}, ${d.y})`}>
          <Glyph kind={d.kind} />
        </g>
      ))}
    </g>
  )
}
