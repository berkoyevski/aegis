import type { GameEvent, Region } from '../types'

export const CRISIS_THRESHOLD = 80

export function makeInsurgentAttack(region: Region): GameEvent {
  return {
    id: `crisis-${region.id}-${Date.now()}`,
    title: 'İsyancı Saldırısı',
    description: `${region.name} bölgesinde gizli hücreler harekete geçti ve bir saldırı düzenlendi. Bölgedeki düzen sarsıldı. Nasıl karşılık vereceksin?`,
    regionId: region.id,
    choices: [
      {
        label: 'Askeri müdahale',
        description: 'Tehdidi sert bastır — ama asker yıpranır, halk tedirgin olur.',
        effect: {
          regionId: region.id,
          threatDelta: -40,
          stabilityDelta: -5,
          happinessDelta: -8,
          reputationDeltas: [{ id: 'military', amount: -4 }],
        },
      },
      {
        label: 'Halkı yatıştır',
        description: 'Sivil yaklaşım — tehdit kısmen azalır, halk memnun kalır.',
        effect: {
          regionId: region.id,
          threatDelta: -15,
          happinessDelta: 5,
          reputationDeltas: [{ id: 'government', amount: -3 }],
        },
      },
      {
        label: 'Görmezden gel',
        description: 'Müdahale etme — tehdit sürer, bölge daha da istikrarsızlaşır.',
        effect: {
          regionId: region.id,
          threatDelta: 5,
          stabilityDelta: -15,
          reputationDeltas: [{ id: 'government', amount: -6 }],
        },
      },
    ],
  }
}
