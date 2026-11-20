import { describe, expect, it } from "vitest";
import {
  demoCleanSales,
  demoSalesWithWash,
  detectWashTrades,
} from "./engines";

describe("detectWashTrades", () => {
  it("flags self-trade, round-trip, and ping-pong on demo wash",
    () => {
      const r = detectWashTrades(demoSalesWithWash());
      const kinds = new Set(r.flags.map((f) => f.kind));
      expect(kinds.has("self_trade")).toBe(true);
      expect(kinds.has("round_trip")).toBe(true);
      expect(kinds.has("ping_pong_pair")).toBe(true);
      expect(r.inputCount).toBe(7);
      expect(r.rawVolume).toBe(135.1);
      expect(r.cleanVolume).toBe(50);
      expect(r.cleanSales).toHaveLength(1);
    });

  it("keeps clean demo mostly clean",
    () => {
      const r = detectWashTrades(demoCleanSales());
      expect(r.flags.length).toBe(0);
      expect(r.rawVolume).toBe(42);
      expect(r.cleanVolume).toBe(42);
    });

  it("flags a return at 3600 seconds and not at 3601", () => {
    const t0 = 1_700_000_000;
    const sale = (id: string, at: number, seller: string, buyer: string) => ({
      id,
      at,
      seller,
      buyer,
      assetKey: "a",
      price: 10,
    });
    const hit = detectWashTrades([
      sale("1", t0, "alice", "bob"),
      sale("2", t0 + 3600, "bob", "alice"),
    ]);
    expect(hit.flags.map((f) => f.kind)).toEqual(["round_trip"]);
    expect(hit.rawVolume).toBe(20);
    expect(hit.cleanVolume).toBe(0);
    const miss = detectWashTrades([
      sale("1", t0, "alice", "bob"),
      sale("2", t0 + 3601, "bob", "alice"),
    ]);
    expect(miss.flags).toEqual([]);
    expect(miss.cleanVolume).toBe(miss.rawVolume);
  });
});
