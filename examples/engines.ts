/**
 * Pure wash-trade heuristics.
 * Detects self-trades, rapid round-trips, and ping-pong pairs.
 * Soft signals — false positives possible (legit market makers, shared wallets).
 */

import type { SaleEvent, WashCleanResult, WashFlag } from "./types";

function norm(a: string): string {
  return a.trim().toLowerCase();
}

export interface WashDetectOptions {
  /** Max seconds between A→B and B→A to count as round-trip */
  roundTripWindowSec?: number;
  /** Max seconds for multi-hop tight cycles on same asset */
  tightCycleWindowSec?: number;
}

const DEFAULTS: Required<WashDetectOptions> = {
  roundTripWindowSec: 3600,
  tightCycleWindowSec: 7200,
};

export function detectWashTrades(
  sales: SaleEvent[],
  options: WashDetectOptions = {}
): WashCleanResult {
  const opts = { ...DEFAULTS, ...options };
  const flags: WashFlag[] = [];
  const flagged = new Set<string>();

  const sorted = [...sales].sort((a, b) => a.at - b.at);

  // Self-trades
  for (const s of sorted) {
    if (norm(s.seller) === norm(s.buyer)) {
      flagged.add(s.id);
      flags.push({
        id: `self-${s.id}`,
        kind: "self_trade",
        saleIds: [s.id],
        severity: "alert",
        message: `Self-trade on ${s.assetKey}: ${s.seller} → ${s.buyer}.`,
      });
    }
  }

  // Round-trips: A sells to B, then B sells same assetKey back to A within window
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    for (let j = i + 1; j < sorted.length; j++) {
      const b = sorted[j];
      if (b.at - a.at > opts.roundTripWindowSec) break;
      if (a.assetKey !== b.assetKey) continue;
      if (
        norm(a.seller) === norm(b.buyer) &&
        norm(a.buyer) === norm(b.seller)
      ) {
        flagged.add(a.id);
        flagged.add(b.id);
        flags.push({
          id: `rt-${a.id}-${b.id}`,
          kind: "round_trip",
          saleIds: [a.id, b.id],
          severity: "warn",
          message: `Round-trip on ${a.assetKey} between ${a.seller} and ${a.buyer} within ${opts.roundTripWindowSec}s.`,
        });
      }
    }
  }

  // Ping-pong pair: same two accounts trade same assetKey ≥3 times in window
  const pairBuckets = new Map<string, SaleEvent[]>();
  for (const s of sorted) {
    const x = norm(s.seller);
    const y = norm(s.buyer);
    if (x === y) continue;
    const pair = [x, y].sort().join("|");
    const key = `${pair}::${s.assetKey}`;
    const list = pairBuckets.get(key) ?? [];
    list.push(s);
    pairBuckets.set(key, list);
  }
  for (const [key, list] of pairBuckets) {
    if (list.length < 3) continue;
    const span = list[list.length - 1].at - list[0].at;
    if (span > opts.tightCycleWindowSec) continue;
    for (const s of list) flagged.add(s.id);
    flags.push({
      id: `pp-${key}`,
      kind: "ping_pong_pair",
      saleIds: list.map((s) => s.id),
      severity: "alert",
      message: `Ping-pong: ${list.length} trades on same pair/asset within ${opts.tightCycleWindowSec}s.`,
    });
  }

  // Tight cycle residual: many trades on same asset with little price move (info)
  const byAsset = new Map<string, SaleEvent[]>();
  for (const s of sorted) {
    const list = byAsset.get(s.assetKey) ?? [];
    list.push(s);
    byAsset.set(s.assetKey, list);
  }
  for (const [asset, list] of byAsset) {
    if (list.length < 4) continue;
    const span = list[list.length - 1].at - list[0].at;
    if (span > opts.tightCycleWindowSec) continue;
    const prices = list.map((s) => s.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const mid = (minP + maxP) / 2 || 1;
    if ((maxP - minP) / mid < 0.02) {
      const already = list.every((s) => flagged.has(s.id));
      if (!already) {
        for (const s of list) flagged.add(s.id);
        flags.push({
          id: `tc-${asset}`,
          kind: "tight_cycle",
          saleIds: list.map((s) => s.id),
          severity: "info",
          message: `Tight cycle on ${asset}: ${list.length} sales, <2% price range — possible wash or thin book.`,
        });
      }
    }
  }

  const cleanSales = sorted.filter((s) => !flagged.has(s.id));
  const rawVolume = sorted.reduce((s, x) => s + x.price, 0);
  const cleanVolume = cleanSales.reduce((s, x) => s + x.price, 0);

  return {
    inputCount: sorted.length,
    cleanSales,
    flaggedSaleIds: [...flagged],
    flags,
    rawVolume,
    cleanVolume,
    removedVolume: rawVolume - cleanVolume,
    methodologyNote:
      "Heuristics: self-trade, round-trip within window, ping-pong pairs, tight low-price-range cycles. Soft flags only — not legal determinations.",
  };
}

/** Demo with clear wash + clean sales */
export function demoSalesWithWash(): SaleEvent[] {
  const t0 = 1_700_000_000;
  return [
    {
      id: "1",
      at: t0,
      seller: "alice",
      buyer: "bob",
      assetKey: "tpl-A",
      price: 10,
    },
    {
      id: "2",
      at: t0 + 600,
      seller: "bob",
      buyer: "alice",
      assetKey: "tpl-A",
      price: 10.1,
    },
    {
      id: "3",
      at: t0 + 1200,
      seller: "carol",
      buyer: "dave",
      assetKey: "tpl-B",
      price: 50,
    },
    {
      id: "4",
      at: t0 + 2000,
      seller: "eve",
      buyer: "eve",
      assetKey: "tpl-C",
      price: 5,
    },
    {
      id: "5",
      at: t0 + 3000,
      seller: "frank",
      buyer: "gina",
      assetKey: "tpl-D",
      price: 20,
    },
    {
      id: "6",
      at: t0 + 3100,
      seller: "gina",
      buyer: "frank",
      assetKey: "tpl-D",
      price: 20.05,
    },
    {
      id: "7",
      at: t0 + 3200,
      seller: "frank",
      buyer: "gina",
      assetKey: "tpl-D",
      price: 19.95,
    },
  ];
}

export function demoCleanSales(): SaleEvent[] {
  const t0 = 1_700_000_000;
  return [
    {
      id: "a",
      at: t0,
      seller: "s1",
      buyer: "b1",
      assetKey: "tpl-X",
      price: 12,
    },
    {
      id: "b",
      at: t0 + 86400,
      seller: "s2",
      buyer: "b2",
      assetKey: "tpl-Y",
      price: 30,
    },
  ];
}
