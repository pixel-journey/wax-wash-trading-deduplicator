# Education — four soft flags, one clock

> **Rung:** `npm test` runs `examples/engines.test.ts` only. `examples/live/**` is excluded because `origins.test.ts` is `node:test`.  
> **The test is the rule.** `fetchRecentSales` was not called.

A sale here is an argument: `id`, unix `at`, `seller`, `buyer`, `assetKey`, `price`. The price is a JavaScript number you passed. It is not a WAX transfer and not an AtomicMarket row.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Name the four kinds and the default windows |
| Intermediate | Predict the 3600 / 3601 edge |
| Masterclass | Keep this lab apart from the other two wash functions, and from AtomicMarket v2 |

---

## Beginner — one scene

```ts
const t0 = 1_700_000_000;
detectWashTrades([
  { id: "1", at: t0, seller: "alice", buyer: "bob", assetKey: "a", price: 10 },
  { id: "2", at: t0 + 3600, seller: "bob", buyer: "alice", assetKey: "a", price: 10 },
]);
// one flag, kind "round_trip"
// rawVolume 20, cleanVolume 0
```

Same pair one second later (`t0 + 3601`) returns `flags: []` and `cleanVolume === rawVolume`.

Defaults in `engines.ts`: `roundTripWindowSec` is `3600`, `tightCycleWindowSec` is `7200`. The comparison is `>`. Equal to the window still flags. One past it does not, because the sales are sorted and the inner loop `break`s.

`self_trade` compares `trim` + `toLowerCase`. `ping_pong_pair` needs at least 3 trades on the same unordered pair and the same `assetKey`, with span `<= 7200`. `tight_cycle` needs at least 4 sales, the same span cap, and `(max - min) / mid < 0.02`. If every sale in that group is already flagged, the tight-cycle row is not added.

The demo fixture still flags `self_trade`, `round_trip`, and `ping_pong_pair`, and its clean volume is lower than its raw volume. The clean demo (two sales, a day apart, different assets) has no flags. The 2% edge and the 7200 edge do not have their own tests.

### Predict, then run

```bash
npm test
```

---

## Intermediate — what the flag does not mean

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Treat 3601 as inside a 3600 window | `>=` or an off-by-one after sort | `b.at - a.at > 3600` then `break` | `3600 seconds and not at 3601` |
| Drop only one leg of a round trip | clean volume keeps a price | both ids are flagged, so both prices leave | same test, `cleanVolume` 0 |
| Call a self-trade a round trip | one row, two kinds | seller === buyer is only `self_trade` | demo wash includes eve→eve |
| Read `price` as a token transfer | 8-decimal WAX | the number you passed, summed with `+` | `rawVolume` 20 |
| Treat the flag as a ban | enforcement | `methodologyNote` says soft flags, not legal determinations | no account field is written |

`mapAtomicSale` divides a string amount by `10 ** precision` (default 8) and keeps `assets[0]` only. A bundle-shaped payload would hide every asset after the first. That mapper was not executed here. `salesUrl` refuses an origin that already has a path, and refuses `limit` 101. Its file is `node:test`, excluded from vitest. This pass ran `node --test examples/live/origins.test.ts` separately.

---

## Masterclass — three wash labs, and v2

| Lab | Clock | Amount | What it returns |
| --- | --- | --- | --- |
| `wax-nft-wash-trading-pattern-flag` | yes | no | two-trade window flag. Not re-opened this pass. |
| `wax-wash-trading-volume-deduplicator` | no | integer | `2 * min(forward, back)`, plus a self-trade added once |
| this repo | yes | JS number | kinds, then sum of unflagged `price` |

AtomicMarket v2.0.0 says a sale, auction, or buy offer is exactly one asset, and `announcesale`, `announceauct`, and `createbuyo` reject more than one. That release note was read. It was not executed. This function does not call `createbuyo`. There is no repo named `wax-nft-wash-trading-deduplicator`.

Native NFT backing stays deprecated. A wash flag is not a holder airdrop and not a `backed_tokens` balance. Snapshot math, if you need it, is `equalSplit` / `duePayout` in `wax-nft-backed-token-unlock-visualizer`.

### What this course will not teach

- That a flag is market manipulation, or that a clean list is innocent
- A live AtomicMarket page (`fetchRecentSales` was not called)
- `atomicdropsx`, pack unbox, or a buy-offer action builder
- Native backing of an NFT
