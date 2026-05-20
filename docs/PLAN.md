# AEGIS — Oyun Tasarım Dokümanı ve Yol Haritası

> Rebel Inc. çekirdeği üzerine kurulmuş, çok-senaryolu, çok-ülkeli bir grand strategy sandbox. Web tabanlı, tek/çok oyunculu büyüme potansiyelli.

**Doküman versiyonu:** 0.5 — 2026-05-19
**Durum:** Sprint 0-5 tamamlandı. Çalışan: SVG harita, state, zaman+bütçe, girişim sistemi, tehdit dinamiği + kriz event sistemi (modal, karar). Operasyonlar (Sprint 5 ikinci yarısı) henüz yapılmadı. Sıradaki: Sprint 6 (reputation + kazanma/kaybetme) ve operasyonlar.

---

## 1. Vizyon

Rebel Inc.'in stabilizasyon/isyan döngüsünü **çekirdek** olarak alıp, üzerine birden çok senaryo (ülkeler arası savaş, sci-fi koloni, tarihsel dönemler) ve hem gerçek hem kurgusal ülke seçimi koyan bir strateji oyunu.

**Tek cümleyle:** "Rebel Inc. + Hoi4 + Democracy 4'ün hafif ama derin bir karışımı, tarayıcıda oynanabilir."

**Ne DEĞİL:** AAA grafikli 3D bir oyun. Saf savaş simülatörü. Tek senaryolu dar bir deneyim.

---

## 2. Teknoloji Stack'i

| Katman | Seçim | Neden |
|---|---|---|
| Dil | **TypeScript** | Tip güvenliği, AI'nin en iyi yazdığı dil |
| UI | **React 18+** | Karmaşık UI panelleri için ideal |
| Build aracı | **Vite** | Hızlı, sıfır config, AI iyi biliyor |
| Stil | **Tailwind CSS** | Hızlı UI, AI çok iyi yazıyor |
| State management | **Zustand** | Redux'tan hafif, AI'a kolay |
| Harita render | **SVG** (önce), gerekirse Canvas | Polygon çizimi için en doğal |
| Veri | **JSON dosyaları** | Ülke/senaryo eklemek kod gerektirmesin |
| Versiyon kontrol | **Git + GitHub** | Yedek + geçmiş + ileride katkıcılar için |
| Editör | **Cursor** (ana) + **Claude Code** (gerektiğinde) | AI asistanlı geliştirme |

**Neden bu stack (kısaca):**
- Cursor + TypeScript + React = AI'nin en iyi çalıştığı kombinasyon → en az hata, en hızlı ilerleme
- Tarayıcıda anında test, kurulum derdi yok
- İleride Tauri ile masaüstü `.exe` çıkarılabilir, Capacitor ile mobile çıkılabilir
- JSON tabanlı veri = yeni ülke/senaryo eklemek dakikalar sürer

---

## 3. Mimari (Katmanlı)

```
┌──────────────────────────────────────────────┐
│  UI Katmanı (React)                          │
│  Harita, paneller, modallar, üst bar         │
├──────────────────────────────────────────────┤
│  Senaryo Katmanı                             │
│  Kazanma/kaybetme, düşman AI, özel olaylar   │
│  (isyan / ülke savaşı / kampanya / ...)      │
├──────────────────────────────────────────────┤
│  Çekirdek Motor (jenerik, senaryodan bağımsız)│
│  Ülke, bölge, nüfus, ekonomi, asker,         │
│  ilişkiler, tick döngüsü, girişim sistemi    │
├──────────────────────────────────────────────┤
│  Veri Katmanı (JSON)                         │
│  Ülke tanımları, senaryolar, girişim ağacı   │
└──────────────────────────────────────────────┘
```

**Kural:** Her katman sadece altındakini bilir. UI senaryoyu bilmez (senaryo UI'a "şu butonu göster" der). Senaryo motoru kullanır ama tersi olmaz.

Klasör yapısı (taslak):
```
/src
  /core           ← jenerik simülasyon motoru
    /entities     ← Country, Region, Population, Treasury
    /systems      ← TickSystem, EconomySystem, ControlSystem
    /types        ← TypeScript tipleri
  /scenarios      ← her senaryo bir klasör
    /insurgency
    /interstate-war
  /ui             ← React bileşenleri
    /map
    /panels
    /modals
    /shared
  /data           ← JSON dosyaları
    /countries
    /scenarios
    /initiatives
  /store          ← Zustand store
/public
/docs             ← bu plan ve diğer dokümanlar
```

---

## 4. Harita Sistemi

**Karar:** Bölge poligonları (Hoi4/Risk tarzı).

**Veri yapısı (TypeScript):**
```typescript
type Region = {
  id: string;
  name: string;
  polygon: [number, number][]; // SVG noktaları
  countryId: string;
  population: number;
  stability: number;          // 0-100
  control: { ownerId: string; level: number };
  hiddenThreat: number;       // gizli düşman varlığı
  initiatives: string[];      // aktif girişim ID'leri
  // ...
};

type Country = {
  id: string;
  name: string;
  capitalRegionId: string;
  traits: string[];           // unique modifier'lar
  treasury: number;
  income: number;             // /tick
  // ...
};
```

**Harita verisi nasıl üretilir?**
- MVP: Hayali ülke "Karastan" için 8-12 bölgeyi elle SVG path olarak çizeceğiz (online SVG editör veya Figma)
- Sonraki adım: gerçek ülkeler için GeoJSON → SVG dönüşümü (Türkiye iller, vs.)

---

## 5. Çekirdek Mekanikler (jenerik, tüm senaryolarda mevcut)

### 5.1 Bölge Bazlı Kontrol
- Her bölgenin "sahibi" ve "stabilite" (0-100) değeri
- Senaryo tanımlar: isyan senaryosunda kontrol = hükümet vs. isyancı; savaşta = ülke A vs ülke B

### 5.2 Hazine ve Gelir
- Her tickte gelir hesaplanır: vergi (bölge stabilitesi ile orantılı) + dış yardım + ticaret
- Girişimler hazineden harcanır (anlık veya sürekli maliyet)

### 5.3 Girişim/Yatırım Ağacı
Üç ana dal:
- **Yönetim:** adalet, eğitim, sağlık, altyapı
- **Güvenlik:** polis, ordu, istihbarat
- **Ekonomi:** vergi politikası, ticaret, sanayi

Her girişim: maliyet, etki (pasif modifier), açma koşulu (önceki girişim, reputation seviyesi, vs.)

### 5.4 Reputation/Memnuniyet Sayaçları
Senaryoya göre değişir, ama jenerik altyapı:
- Halk (population happiness)
- Asker/güvenlik kurumları
- Hükümet/üst yönetim
- (Senaryo ekleyebilir: müttefik ülkeler, lobi grupları)

Sayaçlardan biri sıfırlanırsa senaryo kaybetme koşulunu tetikleyebilir.

### 5.5 Gizli Tehdit ve Kriz Sistemi
- "Gizli düşman varlığı" bölge başına saklı bir sayı
- Periyodik kriz olayları (saldırı, suikast, ayaklanma) — modal popup ile oyuncuya gelir
- İstihbarat yatırımı → görünürlük → operasyonla bastırma

### 5.6 Operasyonlar (tek seferlik aksiyonlar)
Cooldown'lı, maliyetli butonlar:
- Askeri saldırı (bölge, hedef)
- Müzakere
- Propaganda
- Rüşvet/diplomatik baskı
- Sabotaj

### 5.7 Diplomasi (multi-country senaryolarda aktif)
- Ülkeler arası ilişki seviyesi (-100 ile +100)
- Aksiyonlar: savaş ilan et, barış öner, ittifak, ticaret anlaşması
- AI ülkeler otomatik tepki verir (basit rule-based, sonra geliştirilir)

### 5.8 Zaman ve Tikler
- Real-time + pause: hızlar 1x, 2x, 5x
- Bir tick = 1 saniye gerçek zaman = 1 oyun günü (ayarlanabilir)
- Her tikte: gelir, kontrol değişimi, kriz kontrolü, AI hamlesi

---

## 6. Senaryo Sistemi

Her senaryo = bir JSON dosyası + (opsiyonel) bir TypeScript modülü.

JSON tanımlar:
- Başlangıç durumu (hangi ülke aktif, oyuncu rolü, başlangıç hazinesi)
- Kazanma koşulu (tüm bölgeleri stabilize et / X yıl hayatta kal / başkenti al)
- Kaybetme koşulu (reputation sıfır / başkent düşer / süresi dolar)
- Düşman tipi (isyancı / başka ülke / yok)
- Açılan/kapanan mekanikler (savaşta diplomasi aktif, isyanda kapalı vs.)
- Özel olaylar/eventler listesi

**Senaryo roadmap:**
1. **"Stabilizasyon"** (MVP) — Rebel Inc. klonu, modern kurgusal "Karastan"
2. **"Sınır Savaşı"** — iki komşu ülke arası savaş
3. **"Kampanya"** — bağlantılı senaryolar zinciri
4. **Sci-fi koloni** — terraforming + isyan hibrit
5. **Tarihsel** (örn. Roma valisi, Soğuk Savaş vekalet savaşı)

---

## 7. MVP Tanımı (ilk oynanabilir versiyon)

**MVP içerir:**
- Modern kurgusal ülke "Karastan", 8-12 bölgeli SVG harita
- Tek senaryo: Stabilizasyon (isyancı temizleme + halk kazanma)
- Çekirdek mekanikler: hazine, basit girişim ağacı (~10 girişim), 2 reputation sayacı, gizli hücreler, krizler, ~5 operasyon
- Real-time + pause + hız kontrolü
- Kazanma: tüm bölgeleri stabilize et. Kaybetme: hükümet veya asker memnuniyeti sıfırlanır.
- Basit ama temiz UI (Tailwind ile flat tasarım)

**MVP içermez (post-MVP'ye):**
- Birden çok ülke / diplomasi
- Birden çok senaryo
- Gerçek dünya ülkeleri
- Mod desteği
- Multiplayer
- Ses/müzik (placeholder)
- Görsel cila (animasyon, pixel art, illustration)
- Save/load (otomatik localStorage hariç)

---

## 8. Yol Haritası

> Tahmini süre kişisel proje hızına göre. Günde 2-3 saat çalışma varsayımıyla.

### Sprint 0: Setup (1 gün)
- [ ] Vite + React + TS + Tailwind + Zustand iskelet kur
- [ ] Klasör yapısını oluştur
- [ ] ESLint + Prettier
- [ ] Git init, GitHub repo
- [ ] "Merhaba dünya" ekranı

### Sprint 1: Veri Modeli ve State (2-3 gün)
- [ ] TypeScript tipleri: Country, Region, Initiative, Scenario, GameState
- [ ] Zustand store: `gameState`
- [ ] İlk JSON: Karastan ülkesi, 8 bölge (henüz çizim yok, sadece veri)
- [ ] State devtools (basit debug panel)

### Sprint 2: Harita Rendering (3-4 gün)
- [ ] SVG ile bölge poligonları çiz (Karastan)
- [ ] Hover efekti, tıklama, seçili bölge state'i
- [ ] Bölge bilgi paneli (yan panel veya popup)
- [ ] Renk kodlaması (kontrol seviyesi → kırmızı/sarı/yeşil)

### Sprint 3: Zaman ve Bütçe Döngüsü (2-3 gün)
- [ ] Tick sistemi (setInterval veya requestAnimationFrame)
- [ ] Pause/play/hız butonları (üst bar)
- [ ] Hazine ve gelir hesabı her tikte
- [ ] Üst bar UI: tarih, para, hız, reputation göstergeleri

### Sprint 4: Girişim Sistemi (4-5 gün)
- [ ] Girişim ağacı (JSON'da ~10 girişim tanımlı)
- [ ] Aktivasyon UI'ı (yan panel veya alt çubuk)
- [ ] Pasif etkiler hesabı (gelir +X, stabilite +Y)
- [ ] Açma/kilitleme koşulları

### Sprint 5: İsyan ve Krizler (5-7 gün)
- [ ] Gizli hücre sistemi (bölge başına gizli değer)
- [ ] İstihbarat görünürlüğü (yatırımla açılır)
- [ ] Periyodik kriz olayları (modal popup, 5-10 farklı tip)
- [ ] Operasyon aksiyonları (cooldown'lı butonlar, ~5 operasyon)

### Sprint 6: Reputation, Kazanma/Kaybetme (2-3 gün)
- [ ] 2 reputation sayacı (UI'da görünür)
- [ ] Kazanma koşul kontrolü (tüm bölgeler stabilize)
- [ ] Kaybetme koşul kontrolü (reputation sıfır)
- [ ] Bitiş ekranı (zafer/yenilgi modal)

### Sprint 7: Cila ve MVP Lansmanı (3-5 gün)
- [ ] UI cilası (renkler, spacing, fontlar)
- [ ] Basit ses efektleri (opsiyonel)
- [ ] Bug fix, dengeleme (kolay/orta/zor için sayılar)
- [ ] Tutorial overlay (ipuçları, ilk oyunda)

**Toplam MVP tahmini: 4-6 hafta**

### Post-MVP

- **Sprint 8:** Multi-country motoru genişlet, ikinci senaryo (Sınır Savaşı) için altyapı
- **Sprint 9:** Diplomasi sistemi UI
- **Sprint 10:** 10-20 ülke (kurgusal + gerçek), unique trait sistemi
- **Sprint 11:** Üçüncü senaryo / kampanya modu
- **Sprint 12+:** Görsel cila, ses, müzik
- **Uzun vade:** Multiplayer keşfi, mod desteği, mobil port

---

## 9. Risk Analizi (geçen seferki hatalardan kaçınmak için)

| Risk | Etki | Önlem |
|---|---|---|
| Kapsam kayması (her şeyi MVP'ye sıkıştırmak) | Bitirememe | MVP listesine sadık kal, post-MVP'yi bekle |
| Erken optimizasyon | Yavaşlama | Önce çalışır kod, sonra performans |
| AI'nin yanlış mimari önermesi | Karmaşa | Bu PLAN.md'yi her sprintte AI'a referans göster |
| Yetersiz test → bug yığını | Frustrasyon | Her sprintte temel manuel test, kritik mantık için Vitest |
| Burnout (uzun süre görsel sonuç yok) | Motivasyon kaybı | Sprint 2'de görsel harita çıkar — erken tatmin |
| Versiyon kontrolü olmadan kod kaybı | Yıkıcı | Sprint 0'da git kur, her sprint sonunda commit |

---

## 10. Kararlar Günlüğü (Decisions Log)

| Tarih | Karar | Gerekçe |
|---|---|---|
| 2026-05-19 | **Tech stack:** TypeScript + React + Vite + Tailwind + Zustand + SVG | Cursor/AI ile en az hata, hızlı iterasyon |
| 2026-05-19 | **Harita:** bölge poligonları (Hoi4 tarzı) | Hem isyan hem ülke savaşı senaryolarına uyar |
| 2026-05-19 | **Zaman:** real-time + pause | Rebel Inc./Paradox tarzı, oyuna en uygun |
| 2026-05-19 | **Oyuncu rolü:** senaryoya bağlı (esnek) | Hem vali hem ülke lideri rolü desteklenecek |
| 2026-05-19 | **Ülke verisi:** el yapımı, 10-20 ülkeyle başla | Kalite > miktar, MVP odaklı |
| 2026-05-19 | **Görsel hedef:** minimalist flat + dark thematic | Hoi4 + Rebel Inc. melezi, AI ile en kolay, profesyonel |
| 2026-05-19 | **Multiplayer:** post-MVP, ama mimari hazır olsun | Single-player MVP odak, ama Bölüm 11'deki prensipler uygulanır |
| 2026-05-19 | **Git:** sıfırdan birlikte kurulacak (Sprint 0) | Yedek + tarih + ileride katkıcılar için kritik |
| 2026-05-19 | **Oyun adı: AEGIS** | "Kalkan, koruma" — güvenlik/devlet otoritesi teması, çok-senaryolu yapıya uygun |

Cila kararları (ses, isim detayı, yayın platformu, görsel ince detay) **MVP sırasında veya sonrasında** ele alınacak — şimdi netleştirmek erken.

---

## 11. Multiplayer-Ready Mimari Prensipleri

Single-player MVP yapıyoruz, **ama** ileride multiplayer eklerken büyük refactor gerekmesin diye **şu prensipler en baştan uygulanır**:

1. **Deterministic state:** Çekirdek motor saf fonksiyonlar + **seeded RNG**. `Math.random()` doğrudan kullanılmaz — bir `random(state)` helper'ı state'ten seed alır. Aynı state + aynı action = aynı sonuç.
2. **Action-based mutations:** State sadece "Action" objeleri ile değişir. Örn: `{ type: 'ACTIVATE_INITIATIVE', regionId, initiativeId }`. UI direkt state mutate etmez. (Reducer pattern.)
3. **Oyun zamanı ≠ sistem zamanı:** `gameTime` state içinde tutulur; `Date.now()` çekirdek motorda yasak.
4. **Serializable state:** Tüm state JSON.stringify'a uygun (Set/Map/function yok, düz objeler). Save/load + ileride network sync için şart.
5. **Side effect'ler izole:** Ses, görsel efekt, ağ çağrısı core dışında (UI veya effect katmanında).

Bu prensipler MVP'yi **yavaşlatmaz**, ama ileride multiplayer eklemeyi 6 ay yerine 2 hafta yapar.

---

## 12. Açık (Kalan) Sorular

Cila aşamasında ele alınacaklar (şimdi karar gerekmez):
- Ses/müzik kaynağı (ücretsiz kütüphane vs AI üretim)
- Yayın platformu (Itch.io, Steam, kendi web sitesi)
- Görsel ince detaylar (palet, ikonlar, fontlar)

---

## 13. Sonraki Adım — Sprint 0

Plan onaylandı. Sprint 0'a başlayabiliriz:

1. **GitHub hesabı:** github.com'da hesap aç (adım adım birlikte gidicez)
2. **Node.js kurulumu:** node.js indirme + kurulum kontrol
3. **Vite + React + TS proje iskeleti:** `aegis/` klasörü
4. **Bağımlılıklar:** Tailwind, Zustand, ESLint, Prettier
5. **Git init + ilk commit + GitHub'a push**
6. **"Merhaba AEGIS" ekranı** tarayıcıda görünsün

Her adımı tek tek konuşup, sen Cursor'da uygularsın, ben rehberlik ederim. Sprint 0 sonunda elimizde: çalışan boş bir proje + GitHub'da yedek + alışkanlık edinilmiş workflow olacak.
