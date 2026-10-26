# API usage

Wash flags stay in `examples/engines.ts`. The live read is AtomicMarket sold listings, not the Alcor book and not a chain table.

```http
GET https://wax.api.atomicassets.io/atomicmarket/v1/sales?state=3&limit=50&order=desc&sort=updated
```

`state=3` is the sold filter this adapter already used. `limit` above 100 is refused. A collection name, if you type one, is lowercased and must be an Antelope name.

The default origin returned 200 for an AtomicAssets asset page on 2026-10-26. This repo does not invent a second Atomic host. If that origin fails, type another `https` origin with no path. Docs: [AtomicAssets API](https://docs.wax.io/apis/atomic-api.htm).

One page of sales is not the market. Do not raise `limit` to prove a collection is clean.
