# Security — wash trading soft flags (clock window)

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Round-trip at **3600s** | flags |
| Round-trip at **3601s** | does **not** flag |
| Self-trade | `self_trade` kind only |
| Both legs of flagged pair | leave clean volume |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live AtomicMarket | `fetchRecentSales` not on the pure path |
| Legal wash finding | Soft flags only |
| Ban / freeze | Forbidden from this score alone |
| Multi-hop graphs | Not scanned — pairwise window only |

## Attack angles

1. Banning accounts from a single soft flag.  
2. Treating clean volume as proof of innocence.  
3. Hiding a network fetch inside the pure detector.  
4. Confusing this **3600s clock** lab with the volume lab (no clock) or the two-trade pattern flag.  
5. Stretching the window in production without re-testing edge cases at the boundary.

## Honesty limits

No market scan in unit tests. Soft teaching labels only.

| Sibling | Distinction |
| --- | --- |
| [pattern flag](https://github.com/pixel-journey/wax-nft-wash-trading-pattern-flag) | Two-trade reverse predicate |
| [volume deduplicator](https://github.com/pixel-journey/wax-wash-trading-volume-deduplicator) | Arithmetic, **no clock** |
| [velocity scatter](https://github.com/pixel-journey/wax-collection-velocity-scatter-plot) | hold/velocity quadrants, not sale lists |

[docs.wax.io](https://docs.wax.io/).
