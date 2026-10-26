/**
 * Live AtomicMarket sales adapter — network only.
 */

import type { SaleEvent } from "../types";
import { ATOMIC_ORIGINS, salesUrl } from "./origins";

export const DEFAULT_ATOMIC = ATOMIC_ORIGINS[0];
export { ATOMIC_ORIGINS };

interface AtomicSale {
  sale_id: string;
  seller: string;
  buyer?: string;
  updated_at_time?: string;
  price?: { amount: string; token_precision?: number };
  assets?: { template?: { template_id?: string }; asset_id?: string }[];
}

interface AtomicSalesResponse {
  data?: AtomicSale[];
}

export function mapAtomicSale(s: AtomicSale): SaleEvent | null {
  if (!s.buyer) return null;
  const precision = s.price?.token_precision ?? 8;
  const raw = Number(s.price?.amount ?? 0);
  const price = raw / Math.pow(10, precision);
  const assetKey =
    s.assets?.[0]?.template?.template_id?.toString() ||
    s.assets?.[0]?.asset_id ||
    "unknown";
  const ms = s.updated_at_time ? Number(s.updated_at_time) : Date.now();
  const at = Math.floor((ms > 1e12 ? ms : ms * 1000) / 1000);
  return {
    id: String(s.sale_id),
    at,
    seller: s.seller,
    buyer: s.buyer,
    assetKey,
    price,
  };
}

export async function fetchRecentSales(
  options: {
    atomicBase?: string;
    limit?: number;
    collection?: string;
    signal?: AbortSignal;
  } = {}
): Promise<{ sales: SaleEvent[]; source: string }> {
  const limit = options.limit ?? 50;
  const custom = options.atomicBase?.trim();
  const origin = custom || DEFAULT_ATOMIC;
  const built = salesUrl(origin, limit, options.collection);
  if (!built.ok) throw new Error(built.reason);

  const url = built.url;
  const res = await fetch(url, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AtomicMarket ${res.status}: ${res.statusText}`);
  const json = (await res.json()) as AtomicSalesResponse;
  const sales: SaleEvent[] = [];
  for (const row of json.data ?? []) {
    const mapped = mapAtomicSale(row);
    if (mapped) sales.push(mapped);
  }
  return { sales, source: url };
}
