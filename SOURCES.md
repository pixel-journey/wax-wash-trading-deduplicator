# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Marketplace context |
| [volume deduplicator](https://github.com/pixel-journey/wax-wash-trading-volume-deduplicator) | Amount-based wash without clock |
| [pattern flag](https://github.com/pixel-journey/wax-nft-wash-trading-pattern-flag) | Two-trade reverse window |
| [velocity scatter](https://github.com/pixel-journey/wax-collection-velocity-scatter-plot) | Soft wash quadrant (different inputs) |

## Product facts locked by tests

- Defaults: `roundTripWindowSec` **3600**, `tightCycleWindowSec` **7200**.
- Round-trip at exactly 3600 flags; at **3601** does not.
- Kinds: `self_trade`, `round_trip`, `ping_pong_pair`, `tight_cycle`.
- Price is a JS number you passed — not a WAX transfer amount.
- **Not** a live AtomicMarket scan and **not** a ban authority.
