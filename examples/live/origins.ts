/**
 * Unsent AtomicMarket URL rules. This file does not call a host.
 */

export const ATOMIC_ORIGINS = ["https://wax.api.atomicassets.io"] as const;

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;

export function parseHttpsOrigin(
  input: string
): { ok: true; origin: string } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, reason: "origin must be an https URL" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "origin must be https" };
  if (url.username || url.password) return { ok: false, reason: "origin must not include a password" };
  if (url.pathname !== "/" && url.pathname !== "") return { ok: false, reason: "origin must not include a path" };
  if (url.search || url.hash) return { ok: false, reason: "origin must not include a query" };
  return { ok: true, origin: url.origin };
}

export function salesUrl(
  origin: string,
  limit: number,
  collection?: string
): { ok: true; url: string } | { ok: false; reason: string } {
  const parsed = parseHttpsOrigin(origin);
  if (!parsed.ok) return parsed;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return { ok: false, reason: "limit must be an integer from 1 to 100" };
  }
  const name = collection?.trim().toLowerCase();
  if (name && !NAME.test(name)) return { ok: false, reason: "collection_name must be an Antelope name" };
  const url = new URL("/atomicmarket/v1/sales", `${parsed.origin}/`);
  url.searchParams.set("state", "3");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("order", "desc");
  url.searchParams.set("sort", "updated");
  if (name) url.searchParams.set("collection_name", name);
  return { ok: true, url: url.toString() };
}
