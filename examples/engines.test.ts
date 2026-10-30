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
      expect(r.cleanVolume).toBeLessThan(r.rawVolume);
      expect(r.cleanSales.length).toBeLessThan(r.inputCount);
    });

  it("keeps clean demo mostly clean",
    () => {
      const r = detectWashTrades(demoCleanSales());
      expect(r.flags.length).toBe(0);
      expect(r.cleanVolume).toBe(r.rawVolume);
    });
});
