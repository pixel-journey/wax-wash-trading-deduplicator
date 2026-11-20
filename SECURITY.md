# Security — wash trading soft flags

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Round-trip at 3600s | flags; at 3601s does not |
| Self-trade | `self_trade` kind only |
| Both legs of flagged pair | leave clean volume |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live AtomicMarket | `fetchRecentSales` not on the pure path |
| Legal wash finding | Soft flags only |
| Ban / freeze | Forbidden from this score alone |

## Attack angles

1. Banning accounts from a single soft flag.  
2. Treating clean volume as proof of innocence.  
3. Hiding a network fetch inside the pure detector.

## Honesty limits

No market scan in unit tests. [docs.wax.io](https://docs.wax.io/) · [volume deduplicator](https://github.com/pixel-journey/wax-wash-trading-volume-deduplicator) · [pattern flag](https://github.com/pixel-journey/wax-nft-wash-trading-pattern-flag).
