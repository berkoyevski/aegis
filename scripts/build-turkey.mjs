import * as turf from '@turf/turf'
import fs from 'fs'
import https from 'https'

const URL =
  'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json'

function fetchJSON(url) {
  return new Promise((res, rej) => {
    https
      .get(url, (r) => {
        let d = ''
        r.on('data', (c) => (d += c))
        r.on('end', () => res(JSON.parse(d)))
      })
      .on('error', rej)
  })
}

const REGIONS = {
  'tr-trakya': {
    name: 'Trakya', pop: 3000000, happiness: 57, terrain: 'plain',
    desc: 'Avrupa yakası. Ergene ovası, tarım ve sınır kapıları.',
    iller: ['Edirne', 'Kırklareli', 'Tekirdağ', 'Çanakkale'],
  },
  'tr-guney-marmara': {
    name: 'Güney Marmara', pop: 23000000, happiness: 58, terrain: 'city',
    desc: 'İstanbul ve sanayi kalbi. En kalabalık, en zengin bölge.',
    iller: ['İstanbul', 'Kocaeli', 'Sakarya', 'Bursa', 'Yalova', 'Bilecik', 'Balıkesir'],
  },
  'tr-ege': {
    name: 'Ege', pop: 8000000, happiness: 56, terrain: 'coast',
    desc: 'Batı kıyısı. Turizm, zeytin, liman ticareti.',
    iller: ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla'],
  },
  'tr-ic-bati-anadolu': {
    name: 'İç Batı Anadolu', pop: 2200000, happiness: 53, terrain: 'mountain',
    desc: 'Ege ardı yaylalar. Maden ve termal kaynaklar.',
    iller: ['Kütahya', 'Uşak', 'Afyon', 'Afyonkarahisar'],
  },
  'tr-bati-akdeniz': {
    name: 'Batı Akdeniz', pop: 3000000, happiness: 55, terrain: 'mountain',
    desc: 'Toroslar ve Antalya kıyısı. Turizm ve seracılık.',
    iller: ['Antalya', 'Isparta', 'Burdur'],
  },
  'tr-cukurova': {
    name: 'Çukurova', pop: 7500000, happiness: 53, terrain: 'plain',
    desc: 'Doğu Akdeniz ovaları. Pamuk, narenciye, sanayi.',
    iller: ['Mersin', 'İçel', 'Adana', 'Osmaniye', 'Hatay', 'Kahramanmaraş', 'K.Maraş'],
  },
  'tr-ankara': {
    name: 'Ankara Bölümü', pop: 8500000, happiness: 56, terrain: 'city',
    desc: 'Başkent ve çevresi. İdari merkez, tahıl ovaları.',
    iller: ['Ankara', 'Eskişehir', 'Kırıkkale', 'Çankırı', 'Aksaray'],
  },
  'tr-konya': {
    name: 'Konya-Kızılırmak', pop: 5000000, happiness: 51, terrain: 'plain',
    desc: 'Orta Anadolu platosu. Tahıl ambarı, geniş bozkır.',
    iller: ['Konya', 'Karaman', 'Niğde', 'Nevşehir', 'Kırşehir', 'Sivas', 'Yozgat', 'Kayseri'],
  },
  'tr-bati-karadeniz': {
    name: 'Batı Karadeniz', pop: 4000000, happiness: 51, terrain: 'forest',
    desc: 'Ormanlık kuzey dağları. Kömür, kereste, fındık.',
    iller: ['Zonguldak', 'Bartın', 'Karabük', 'Kastamonu', 'Sinop', 'Çorum', 'Amasya', 'Tokat', 'Bolu', 'Düzce'],
  },
  'tr-dogu-karadeniz': {
    name: 'Doğu Karadeniz', pop: 3500000, happiness: 50, terrain: 'forest',
    desc: 'Yağışlı sarp dağlar. Çay, fındık, dik vadiler.',
    iller: ['Samsun', 'Ordu', 'Giresun', 'Trabzon', 'Rize', 'Artvin', 'Gümüşhane', 'Bayburt'],
  },
  'tr-erzurum-kars': {
    name: 'Erzurum-Kars', pop: 2500000, happiness: 47, terrain: 'mountain',
    desc: 'Yüksek kuzeydoğu yaylaları. Sert kış, hayvancılık.',
    iller: ['Erzurum', 'Erzincan', 'Kars', 'Ardahan', 'Iğdır', 'Ağrı'],
  },
  'tr-van': {
    name: 'Van Bölümü', pop: 3500000, happiness: 46, terrain: 'lake',
    desc: 'Van Gölü çevresi ve doğu dağları. Seyrek nüfus.',
    iller: ['Van', 'Muş', 'Bitlis', 'Bingöl', 'Tunceli', 'Elazığ', 'Malatya', 'Hakkari', 'Hakkâri'],
  },
  'tr-orta-firat': {
    name: 'Orta Fırat', pop: 5500000, happiness: 49, terrain: 'plain',
    desc: 'Fırat havzası. Sulama tarımı, antik kentler.',
    iller: ['Gaziantep', 'Kilis', 'Adıyaman', 'Şanlıurfa', 'Urfa'],
  },
  'tr-dicle': {
    name: 'Dicle', pop: 4000000, happiness: 48, terrain: 'plain',
    desc: 'Dicle havzası ve güneydoğu sınırı. Verimli ovalar.',
    iller: ['Diyarbakır', 'Mardin', 'Batman', 'Siirt', 'Şırnak'],
  },
}

const geo = await fetchJSON(URL)
const byName = {}
for (const f of geo.features) byName[f.properties.name] = f

const mapped = new Set()
for (const r of Object.values(REGIONS)) r.iller.forEach((i) => mapped.add(i))
const unmappedGeo = Object.keys(byName).filter((n) => !mapped.has(n))
console.log('GeoJSON il sayısı:', geo.features.length)
console.log("EŞLENMEYEN GeoJSON illeri:", unmappedGeo)

// bbox + equirectangular (cos-lat düzeltmeli)
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
turf.coordEach(geo, ([lon, lat]) => {
  minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon)
  minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
})
const lat0 = (((minLat + maxLat) / 2) * Math.PI) / 180
const lonSpan = (maxLon - minLon) * Math.cos(lat0)
const latSpan = maxLat - minLat
const PAD = 24
const W = 1000
const H = Math.round(((W - 2 * PAD) * latSpan) / lonSpan + 2 * PAD)

function project([lon, lat]) {
  const x = PAD + (((lon - minLon) * Math.cos(lat0)) / lonSpan) * (W - 2 * PAD)
  const y = PAD + ((maxLat - lat) / latSpan) * (H - 2 * PAD)
  return [x, y]
}
function ringToPath(ring) {
  return (
    ring.map((c, i) => {
      const [x, y] = project(c)
      return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ') + ' Z'
  )
}

// gerçek lat/lon → SVG (project [lon,lat] bekliyor)
function lineToPath(latlons) {
  return latlons
    .map(([lat, lon], i) => {
      const [x, y] = project([lon, lat])
      return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}
function lakeToPath(latlons) {
  return lineToPath(latlons) + ' Z'
}

// büyük göller (yaklaşık gerçek konum, oval)
const LAKES = [
  { name: 'Van Gölü', ring: [[38.95, 42.4], [38.8, 43.25], [38.45, 43.6], [38.3, 43.1], [38.35, 42.4], [38.65, 42.15]] },
  { name: 'Tuz Gölü', ring: [[39.05, 33.2], [38.95, 33.65], [38.5, 33.7], [38.4, 33.25], [38.75, 32.95]] },
  { name: 'Beyşehir', ring: [[37.95, 31.4], [37.85, 31.72], [37.55, 31.62], [37.62, 31.32]] },
]

// ana nehirler (kaynak→ağız, yaklaşık gerçek güzergah)
const RIVERS = [
  { name: 'Kızılırmak', pts: [[39.8, 38.3], [39.5, 37.0], [39.0, 35.8], [38.8, 34.5], [39.5, 33.8], [40.3, 34.2], [41.0, 35.2], [41.7, 35.95]] },
  { name: 'Fırat', pts: [[39.7, 40.5], [39.2, 39.5], [38.7, 39.0], [38.2, 38.6], [37.6, 38.2], [37.0, 38.0]] },
  { name: 'Dicle', pts: [[38.4, 39.9], [37.9, 40.3], [37.6, 41.2], [37.3, 42.0]] },
  { name: 'Sakarya', pts: [[39.4, 31.5], [40.0, 31.0], [40.7, 30.6], [41.1, 30.7]] },
  { name: 'Yeşilırmak', pts: [[39.9, 36.2], [40.3, 36.5], [40.8, 36.6], [41.3, 36.65]] },
]

// deterministik random (LCG)
function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const DECOR_BY_TERRAIN = {
  mountain: { kind: 'mountain', count: 6 },
  forest: { kind: 'tree', count: 8 },
  plain: { kind: 'wheat', count: 4 },
  coast: { kind: 'wave', count: 3 },
  city: { kind: 'building', count: 3 },
  lake: { kind: 'mountain', count: 4 },
}

function buildDecorations(merged, terrain, labelXY, seedBase) {
  const cfg = DECOR_BY_TERRAIN[terrain] ?? DECOR_BY_TERRAIN.plain
  const bb = turf.bbox(merged)
  const rng = makeRng(seedBase)
  const out = []
  let tries = 0
  while (out.length < cfg.count && tries < 400) {
    tries++
    const lon = bb[0] + rng() * (bb[2] - bb[0])
    const lat = bb[1] + rng() * (bb[3] - bb[1])
    if (!turf.booleanPointInPolygon(turf.point([lon, lat]), merged)) continue
    const [x, y] = project([lon, lat])
    // etiket/şehir ikonu çevresinden kaçın
    if (Math.abs(x - labelXY[0]) < 46 && Math.abs(y - labelXY[1]) < 40) continue
    out.push({ x: Math.round(x), y: Math.round(y), kind: cfg.kind })
  }
  return out
}

const out = {
  id: 'turkiye', name: 'Türkiye', capitalRegionId: 'tr-ankara',
  viewBox: `0 0 ${W} ${H}`,
  traits: ['large', 'diverse-population', 'regional-disparity'],
  lakes: LAKES.map((l) => ({ name: l.name, path: lakeToPath(l.ring) })),
  rivers: RIVERS.map((r) => ({ name: r.name, path: lineToPath(r.pts) })),
  regions: [],
}

for (const [id, r] of Object.entries(REGIONS)) {
  let merged = null
  const used = []
  for (const il of r.iller) {
    const f = byName[il]
    if (!f) continue
    used.push(il)
    merged = merged ? turf.union(turf.featureCollection([merged, f])) : f
  }
  merged = turf.simplify(merged, { tolerance: 0.015, highQuality: true })
  const geom = merged.geometry
  const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates]
  // alanca büyükten küçüğe, küçük adacıkları at (en büyük 2 parça yeter)
  polys.sort((a, b) => Math.abs(turf.area(turf.polygon(b))) - Math.abs(turf.area(turf.polygon(a))))
  const keep = polys.slice(0, 2)
  const d = keep.map((p) => ringToPath(p[0])).join(' ')
  const c = turf.centroid(merged)
  const [lx, ly] = project(c.geometry.coordinates)
  const labelNudge = { 'tr-cukurova': 12, 'tr-konya': 8, 'tr-van': -18 }
  const finalLabel = [Math.round(lx), Math.round(ly + (labelNudge[id] ?? 0))]
  const decorations = buildDecorations(merged, r.terrain, finalLabel, 1000 + out.regions.length * 97)
  out.regions.push({
    id, name: r.name, path: d,
    labelX: finalLabel[0], labelY: finalLabel[1],
    population: r.pop, happiness: r.happiness, terrain: r.terrain,
    decorations, description: r.desc,
  })
  console.log(`${r.name}: ${used.length} il, path ${d.length} char`)
}

fs.writeFileSync(
  'src/data/countries/turkiye.json',
  JSON.stringify(out, null, 2)
)
console.log(`\nviewBox: 0 0 ${W} ${H}`)
console.log('turkiye.json yazıldı.')
