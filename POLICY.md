# Policy — wash trading deduplicator

**Trust label:** `educational-reference`  
**Updated:** 2026-10-30

## In scope

- Pure heuristics on `SaleEvent[]` (self-trade, round-trip, ping-pong, tight cycle)
- Optional soft-fail live AtomicMarket sold listings
- Demo fixtures · CSV/MD export

## Out of scope

- Legal determinations of market manipulation
- Exchange surveillance products
- Automatic account bans or enforcement

## Rules

- Always surface that flags are soft
- Prefer WharfKit only if a host app adds signing (this repo does not rotate keys)
