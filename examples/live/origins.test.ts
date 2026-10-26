import assert from "node:assert/strict";
import { test } from "node:test";
import { ATOMIC_ORIGINS, salesUrl } from "./origins.ts";

test("builds a sold-listing page and refuses a path on the origin", () => {
  const row = salesUrl("https://wax.api.atomicassets.io/", 20, "PixelJourney");
  assert.equal(row.ok, true);
  if (!row.ok) return;
  assert.equal(
    row.url,
    "https://wax.api.atomicassets.io/atomicmarket/v1/sales?state=3&limit=20&order=desc&sort=updated&collection_name=pixeljourney"
  );
  assert.equal(salesUrl("https://wax.api.atomicassets.io/atomicmarket", 20).ok, false);
  assert.equal(salesUrl(ATOMIC_ORIGINS[0], 101).ok, false);
});
