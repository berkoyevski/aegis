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
  'tr-marmara': {
    name: 'Marmara',
    pop: 26000000,
    happiness: 58,
    desc: 'Kuzeybatı. İstanbul ve sanayi merkezi, en kalabalık bölge.',
    iller: ['İstanbul', 'Edirne', 'Kırklareli', 'Tekirdağ', 'Çanakkale', 'Balıkesir', 'Bursa', 'Yalova', 'Kocaeli', 'Sakarya', 'Bilecik'],
  },
  'tr-ege': {
    name: 'Ege',
    pop: 10000000,
    happiness: 56,
    desc: 'Batı kıyısı. Tarım, turizm ve liman ticareti.',
    iller: ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Uşak', 'Kütahya', 'Afyon', 'Afyonkarahisar'],
  },
  'tr-akdeniz': {
    name: 'Akdeniz',
    pop: 10500000,
    happiness: 54,
    desc: 'Güney sahili. Toroslar, narenciye tarımı ve turizm.',
    iller: ['Antalya', 'Isparta', 'Burdur', 'Mersin', 'İçel', 'Adana', 'Osmaniye', 'Hatay', 'Kahramanmaraş', 'K.Maraş'],
  },
  'tr-ic-anadolu': {
    name: 'İç Anadolu',
    pop: 13000000,
    happiness: 55,
    desc: 'Merkez plato. Başkent Ankara ve tahıl ovaları.',
    iller: ['Ankara', 'Konya', 'Kayseri', 'Eskişehir', 'Sivas', 'Yozgat', 'Aksaray', 'Karaman', 'Kırıkkale', 'Kırşehir', 'Nevşehir', 'Niğde', 'Çankırı'],
  },
  'tr-karadeniz': {
    name: 'Karadeniz',
    pop: 7500000,
    happiness: 52,
    desc: 'Kuzey şeridi. Yağışlı dağlar, çay ve fındık.',
    iller: ['Zonguldak', 'Bartın', 'Karabük', 'Kastamonu', 'Sinop', 'Çorum', 'Amasya', 'Tokat', 'Samsun', 'Ordu', 'Giresun', 'Trabzon', 'Rize', 'Artvin', 'Gümüşhane', 'Bayburt', 'Bolu', 'Düzce'],
  },
  'tr-dogu-anadolu': {
    name: 'Doğu Anadolu',
    pop: 5700000,
    happiness: 47,
    desc: 'Yüksek doğu dağları. Sert iklim, hayvancılık.',
    iller: ['Erzurum', 'Erzincan', 'Kars', 'Ardahan', 'Iğdır', 'Ağrı', 'Van', 'Muş', 'Bitlis', 'Bingöl', 'Tunceli', 'Elazığ', 'Malatya', 'Hakkari', 'Hakkâri'],
  },
  'tr-guneydogu-anadolu': {
    name: 'Güneydoğu Anadolu',
    pop: 9000000,
    happiness: 48,
    desc: 'Güneydoğu. Verimli ovalar, sulama tarımı.',
    iller: ['Gaziantep', 'Şanlıurfa', 'Urfa', 'Diyarbakır', 'Mardin', 'Batman', 'Siirt', 'Şırnak', 'Kilis', 'Adıyaman'],
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

const out = {
  id: 'turkiye', name: 'Türkiye', capitalRegionId: 'tr-ic-anadolu',
  viewBox: `0 0 ${W} ${H}`,
  traits: ['large', 'diverse-population', 'regional-disparity'],
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
  const labelNudge = { 'tr-akdeniz': 34, 'tr-karadeniz': -6 }
  out.regions.push({
    id, name: r.name, path: d,
    labelX: Math.round(lx), labelY: Math.round(ly + (labelNudge[id] ?? 0)),
    population: r.pop, happiness: r.happiness, description: r.desc,
  })
  console.log(`${r.name}: ${used.length} il, path ${d.length} char`)
}

fs.writeFileSync(
  'src/data/countries/turkiye.json',
  JSON.stringify(out, null, 2)
)
console.log(`\nviewBox: 0 0 ${W} ${H}`)
console.log('turkiye.json yazıldı.')
