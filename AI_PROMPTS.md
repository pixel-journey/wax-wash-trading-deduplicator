# AI handoff — wash trading deduplicator

## Non-negotiables

1. Defaults: `roundTripWindowSec` **3600**, `tightCycleWindowSec` **7200**.
2. Round-trip at exactly **3600** flags; at **3601** does not.
3. Kinds: `self_trade`, `round_trip`, `ping_pong_pair`, `tight_cycle`.
4. Price is a **JS number you passed** — not a WAX transfer amount.
5. **Not** a live AtomicMarket scan and **not** a ban authority.
6. Related: volume deduplicator (no clock); pattern flag (two-trade reverse only).

## Prompt seeds

- "Given SaleEvent JSON, run detectWashTrades and summarize flags and volume removed."
- "Sketch mapping AtomicMarket sale rows into SaleEvent { id, at, seller, buyer, assetKey, price }."
- "Round-trip gap 3600 vs 3601 — which flags?"
- "Refuse treating flags as proof for account suspension."

## Do not

- Scan live markets from unit tests.
- Claim legal/compliance findings.
- Merge with volume-only deduplicator without reading both.
