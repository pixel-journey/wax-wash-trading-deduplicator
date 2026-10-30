# wax-wash-trading-deduplicator

> **Trust label:** `educational-reference`  
> **Status:** Engine + live + education pass (2026-10-30)

Soft **wash-trade heuristics** on sale events → raw vs clean volume.

| Kind | Idea |
|------|------|
| `self_trade` | seller === buyer |
| `round_trip` | A→B then B→A same asset in window |
| `ping_pong_pair` | ≥3 trades same pair/asset in window |
| `tight_cycle` | many sales, <2% price range |

Not legal conclusions. Market makers can look similar.

```bash
npm install && npm test && npm run dev
```

[POLICY.md](./POLICY.md)

MIT — Pixel Journey
