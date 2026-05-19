# UI Layer

React bileşenleri. Senaryodan bağımsız.

- `map/` — SVG harita, bölge poligonları, hover/click
- `panels/` — yan paneller (bölge bilgisi, girişimler)
- `modals/` — kriz olayları, bitiş ekranı
- `shared/` — düğme, slider, kart gibi temel bileşenler

**Kural:** UI direkt state mutate etmez. Store action'larını çağırır.
