# AI_PROMPTS.md — Wash Trading Deduplicator

## 1. Detect

```
Given SaleEvent JSON, run detectWashTrades and summarize flags and volume removed.
```

## 2. AtomicMarket mapping

```
Sketch mapping AtomicMarket sale rows into SaleEvent { id, at, seller, buyer, assetKey, price }.
```
