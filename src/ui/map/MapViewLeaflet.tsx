import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Layer } from 'leaflet'
import type { Feature, Geometry } from 'geojson'
import { GeoJSON, MapContainer, Marker, TileLayer } from 'react-leaflet'
import regionsGeo from '../../data/countries/turkiye-regions.json'
import { INSURGENT_FACTION } from '../../core/types'
import type { Region } from '../../core/types'
import { useGameStore } from '../../store/gameStore'

// Rebel Inc mantığı: arazi görünür kalsın; durum bir "tehlike sisi" ile gösterilir.
// Stabil/kontrollü bölge ~şeffaf (arazi net). İstikrarsız/isyancı bölge kırmızı sis.
function statusOverlay(
  stability: number,
  isInsurgent: boolean,
  selected: boolean
): { fillColor: string; fillOpacity: number } {
  if (isInsurgent) return { fillColor: 'hsl(358, 72%, 46%)', fillOpacity: 0.45 }
  // stabilite düştükçe kırmızı sis yoğunlaşır; yükseldikçe hafif altın huzur
  if (stability >= 70) {
    return { fillColor: 'hsl(140, 50%, 50%)', fillOpacity: selected ? 0.22 : 0.08 }
  }
  const danger = (70 - stability) / 70 // 0..1
  const hue = 45 - danger * 45 // sarı→kırmızı
  return {
    fillColor: `hsl(${hue}, 70%, 48%)`,
    fillOpacity: (selected ? 0.18 : 0.12) + danger * 0.28,
  }
}

const CASTLE = `<svg width="30" height="26" viewBox="-15 -22 30 28"><g fill="#fff" stroke="rgba(0,0,0,0.5)" stroke-width="0.6"><rect x="-13" y="-2" width="26" height="12"/><rect x="-13" y="-8" width="5" height="6"/><rect x="-3" y="-8" width="6" height="6"/><rect x="8" y="-8" width="5" height="6"/><rect x="-1" y="-20" width="1.4" height="12"/></g><path d="M-0.3,-20 L9,-17 L-0.3,-14 Z" fill="#d4af37"/></svg>`
const CITY = `<svg width="26" height="22" viewBox="-13 -16 26 22"><g fill="#fff" stroke="rgba(0,0,0,0.5)" stroke-width="0.6"><rect x="-11" y="-3" width="5" height="9"/><rect x="-4" y="-12" width="6" height="18"/><rect x="4" y="-6" width="5" height="12"/></g></svg>`
const WARN = `<svg width="16" height="15" viewBox="-9 -10 18 16"><path d="M0,-9 L9,6 L-9,6 Z" fill="rgba(220,38,38,0.95)" stroke="#ffd0d0" stroke-width="1" stroke-linejoin="round"/><rect x="-1" y="-4" width="2" height="6" fill="#fff"/><rect x="-1" y="3.5" width="2" height="2" fill="#fff"/></svg>`

function makeIcon(r: Region, isCapital: boolean, isInsurgent: boolean) {
  const showThreat = isInsurgent || r.hiddenThreat >= 55
  const sub = isInsurgent
    ? 'isyancı'
    : isCapital
      ? 'başkent'
      : `stab ${Math.round(r.stability)}`
  const subColor = isInsurgent ? '#ff8a8a' : '#e8eaec'
  const html = `
    <div style="position:relative;width:120px;transform:translateX(-60px);text-align:center;line-height:1.1">
      ${showThreat ? `<div style="position:absolute;left:50%;top:-6px;transform:translateX(8px)">${WARN}</div>` : ''}
      <div style="display:flex;justify-content:center;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.6))">${isCapital ? CASTLE : CITY}</div>
      <div style="color:#fff;font-weight:700;font-size:13px;text-shadow:0 1px 3px #000,0 0 3px #000;white-space:nowrap">${r.name}</div>
      <div style="color:${subColor};font-size:9px;letter-spacing:1px;text-transform:uppercase;text-shadow:0 1px 2px #000">${sub}</div>
    </div>`
  return L.divIcon({ html, className: '', iconSize: [120, 56], iconAnchor: [60, 30] })
}

export function MapViewLeaflet() {
  const regions = useGameStore((s) => s.regions)
  const dispatch = useGameStore((s) => s.dispatch)
  const selectedRegionId = useGameStore((s) => s.selectedRegionId)
  const capitalRegionId = useGameStore(
    (s) => s.countries[s.playerCountryId].capitalRegionId
  )

  function styleFn(feature?: Feature<Geometry>) {
    const id = feature?.properties?.id as string
    const r = regions[id]
    const selected = id === selectedRegionId
    const isInsurgent = r ? r.control.ownerId === INSURGENT_FACTION : false
    const ov = r
      ? statusOverlay(r.stability, isInsurgent, selected)
      : { fillColor: '#888', fillOpacity: 0.2 }
    return {
      fillColor: ov.fillColor,
      fillOpacity: ov.fillOpacity,
      color: selected ? '#d4af37' : 'rgba(255,255,255,0.85)',
      weight: selected ? 3.5 : 1.3,
    }
  }

  function onEach(feature: Feature<Geometry>, layer: Layer) {
    const id = feature.properties?.id as string
    layer.on('click', () => {
      dispatch({
        type: 'SELECT_REGION',
        regionId: id === selectedRegionId ? null : id,
      })
    })
  }

  const markers = Object.values(regions).filter(
    (r) => r.labelLat != null && r.labelLon != null
  )

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[39, 35.2]}
        zoom={6}
        minZoom={5}
        maxZoom={9}
        style={{ height: '100%', width: '100%', background: 'var(--color-bg)' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />
        <GeoJSON
          key={selectedRegionId ?? 'none'}
          data={regionsGeo as never}
          style={styleFn as never}
          onEachFeature={onEach}
        />
        {markers.map((r) => (
          <Marker
            key={r.id}
            position={[r.labelLat as number, r.labelLon as number]}
            icon={makeIcon(
              r,
              r.id === capitalRegionId,
              r.control.ownerId === INSURGENT_FACTION
            )}
            eventHandlers={{
              click: () =>
                dispatch({
                  type: 'SELECT_REGION',
                  regionId: r.id === selectedRegionId ? null : r.id,
                }),
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
