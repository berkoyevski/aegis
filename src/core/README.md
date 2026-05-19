# Core Engine

Senaryodan bağımsız çekirdek simülasyon motoru.

- `entities/` — Country, Region, Population, Treasury tipleri
- `systems/` — TickSystem, EconomySystem, ControlSystem
- `types/` — Ortak TypeScript tipleri

**Kural:** Bu klasördeki kod hiçbir senaryoya veya UI'a bağımlı olmamalı. `Math.random()` doğrudan kullanılmaz — seeded RNG zorunlu.
