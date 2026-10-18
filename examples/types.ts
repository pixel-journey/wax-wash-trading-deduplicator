/**
 * Types for educational wash-trade heuristics on marketplace sales.
 * Soft flags only — not regulatory findings.
 */

export interface SaleEvent {
  id: string;
  /** Unix seconds */
  at: number;
  seller: string;
  buyer: string;
  /** Asset or template id for grouping */
  assetKey: string;
  /** Price in a single unit (e.g. WAX) */
  price: number;
}

export type WashFlagKind =
  | "round_trip"
  | "tight_cycle"
  | "self_trade"
  | "ping_pong_pair";

export interface WashFlag {
  id: string;
  kind: WashFlagKind;
  saleIds: string[];
  message: string;
  severity: "info" | "warn" | "alert";
}

export interface WashCleanResult {
  inputCount: number;
  cleanSales: SaleEvent[];
  flaggedSaleIds: string[];
  flags: WashFlag[];
  rawVolume: number;
  cleanVolume: number;
  removedVolume: number;
  methodologyNote: string;
}
