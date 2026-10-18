# ARCHITECTURE.md — Wash Trading Deduplicator

## Invariants

1. Detection pure given SaleEvent[] + options
2. Flags cite kind and sale ids
3. Soft-signal disclaimer required
4. Clean set = sales not in flagged ids

## Flow

```
AtomicMarket sales → SaleEvent[] → detectWashTrades → UI
```

---

*Pixel Journey*
