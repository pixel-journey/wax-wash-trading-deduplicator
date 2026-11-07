# Soft flags on sales you already have

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

`detectWashTrades` reads a list of `{ id, at, seller, buyer, assetKey, price }`. It does not scan AtomicMarket. A return at 3600 seconds is a `round_trip`. A return at 3601 seconds is not. Both prices leave `cleanVolume` only when the flag hits.

| Kind | Predicate in `examples/engines.ts` |
| --- | --- |
| `self_trade` | seller and buyer match after trim and lower-case |
| `round_trip` | A→B then B→A, same `assetKey`, `delta <= 3600` |
| `ping_pong_pair` | at least 3 trades, same pair and asset, span `<= 7200` |
| `tight_cycle` | at least 4 sales, span `<= 7200`, price range under 2%, and not already all flagged |

These are soft heuristics. Not a legal finding. Market makers can look the same.

The course is [EDUCATION.md](./EDUCATION.md). Policy is [POLICY.md](./POLICY.md).

Two other labs are different functions. `wax-nft-wash-trading-pattern-flag` is two trades and a window, no amounts. `wax-wash-trading-volume-deduplicator` subtracts integer amounts and has no clock. Do not mix them.

```bash
npm test
```

`fetchRecentSales` is in `examples/live/atomicmarket.ts`. This pass did not call it. `examples/live/origins.test.ts` is `node:test`. Vitest excludes `examples/live/**`. Run that file with `node --test examples/live/origins.test.ts`.

MIT — Pixel Journey
