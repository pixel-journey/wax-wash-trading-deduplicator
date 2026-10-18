# wax-wash-trading-deduplicator

> **Status:** 🔄 Promoted from concept (PX Perfection Standard v1.1)  
> **Category:** Marketplace analytics  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Detect soft **wash-trade patterns** in sale events and report **raw vs clean volume** — self-trades, round-trips, ping-pong pairs, tight low-price-range cycles.

> Heuristics only. Not legal or exchange-surveillance conclusions. Legit market makers can look similar.

---

## Quick Start

```ts
import { detectWashTrades } from "./examples/engines";

const result = detectWashTrades(sales); // SaleEvent[]
// result.cleanVolume, result.flags, result.cleanSales
```

## Heuristics

| Kind | Idea |
|------|------|
| `self_trade` | seller === buyer |
| `round_trip` | A→B then B→A same asset in window |
| `ping_pong_pair` | ≥3 trades same pair/asset in window |
| `tight_cycle` | many sales, <2% price range |

## License

MIT — **Pixel Journey**

*Promoted from README-only: October 2026*
