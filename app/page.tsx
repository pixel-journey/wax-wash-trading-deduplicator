'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  demoCleanSales,
  demoSalesWithWash,
  detectWashTrades,
} from '../examples/engines';
import {
  downloadText,
  exportFlagsCsv,
  exportSummaryMarkdown,
} from '../examples/exportCsv';
import { fetchRecentSales } from '../examples/live/atomicmarket';
import { WASH_MYTHS } from '../examples/myths';
import type { WashCleanResult } from '../examples/types';

type Mode = 'live' | 'wash' | 'clean';

export default function WashTradingDeduplicator() {
  const [mode, setMode] = useState<Mode>('live');
  const [collection, setCollection] = useState('');
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<WashCleanResult | null>(null);
  const [meta, setMeta] = useState<string | null>(null);

  const demoResult = useMemo(() => {
    if (mode === 'wash') return detectWashTrades(demoSalesWithWash());
    if (mode === 'clean') return detectWashTrades(demoCleanSales());
    return null;
  }, [mode]);

  const result = mode === 'live' ? liveResult : demoResult;

  const runLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const { sales, source } = await fetchRecentSales({
        limit: 50,
        collection: collection.trim() || undefined,
        atomicBase: origin.trim() || undefined,
      });
      if (sales.length === 0) {
        setError('No sold listings returned.');
        setLiveResult(null);
        return;
      }
      setLiveResult(detectWashTrades(sales));
      setMeta(`${sales.length} sales · ${source}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setLiveResult(null);
    } finally {
      setLoading(false);
    }
  }, [collection, origin]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          WASH TRADING DEDUPLICATOR
        </div>
        <div className="text-xs opacity-60 mb-2">
          Pixel Journey · educational-reference · soft heuristics
        </div>
        <p className="text-xs opacity-50 mb-6 max-w-2xl">
          Flags are not legal conclusions. Legit market makers can look similar.
        </p>

        <section
          className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/5 p-4 text-xs space-y-3 max-w-2xl mb-6"
          aria-label="Myths"
        >
          <h2 className="text-sm font-semibold text-fuchsia-100">Myths vs reality</h2>
          {WASH_MYTHS.map((m) => (
            <div key={m.myth}>
              <p className="text-red-200/90">
                <span className="opacity-60">Myth: </span>
                {m.myth}
              </p>
              <p className="text-emerald-100/90 mt-0.5">
                <span className="opacity-60">Reality: </span>
                {m.reality}
              </p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'live' ? 'bg-sky-600' : 'bg-white/10'
            }`}
          >
            Live market
          </button>
          <button
            type="button"
            onClick={() => setMode('wash')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'wash' ? 'bg-amber-600' : 'bg-white/10'
            }`}
          >
            Demo wash
          </button>
          <button
            type="button"
            onClick={() => setMode('clean')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'clean' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo clean
          </button>
        </div>

        {mode === 'live' && (
          <div className="border border-white/10 bg-black/40 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-3">
            <input
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
              placeholder="Optional collection_name"
            />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
              placeholder="Custom Atomic origin (optional)"
            />
            <button
              type="button"
              onClick={runLive}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-sky-600 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Fetching…' : 'Analyze live'}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {status && (
          <p className="mb-4 text-xs text-emerald-200/80" role="status">
            {status}
          </p>
        )}
        {meta && (
          <div className="mb-4 text-xs opacity-50 break-all">{meta}</div>
        )}

        {result && (
          <div className="border border-white/10 bg-black/40 p-6 rounded-2xl mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="opacity-50 text-xs">Raw volume</div>
                <div className="font-mono text-xl">
                  {result.rawVolume.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="opacity-50 text-xs">Clean volume</div>
                <div className="font-mono text-xl text-emerald-400">
                  {result.cleanVolume.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="opacity-50 text-xs">Removed</div>
                <div className="font-mono text-amber-400">
                  {result.removedVolume.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="opacity-50 text-xs">Kept</div>
                <div className="font-mono">
                  {result.cleanSales.length}/{result.inputCount}
                </div>
              </div>
            </div>
            <p className="text-xs opacity-60 mb-4">{result.methodologyNote}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg bg-emerald-900"
                onClick={() => {
                  downloadText(
                    'wash-flags.csv',
                    exportFlagsCsv(result),
                    'text/csv;charset=utf-8'
                  );
                  setStatus('Flags CSV downloaded');
                }}
              >
                Download flags CSV
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg bg-sky-900"
                onClick={() => {
                  downloadText(
                    'wash-summary.md',
                    exportSummaryMarkdown(result),
                    'text/markdown;charset=utf-8'
                  );
                  setStatus('Summary MD downloaded');
                }}
              >
                Download summary MD
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {result.flags.length === 0 && (
                <li className="opacity-60">No flags on this set.</li>
              )}
              {result.flags.map((f) => (
                <li key={f.id}>
                  [{f.severity}/{f.kind}] {f.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!result && mode === 'live' && !loading && !error && (
          <p className="text-sm opacity-50 mb-6">
            Fetch recent sold AtomicMarket listings (optional collection filter).
          </p>
        )}

        <p className="text-xs opacity-60">
          Live: AtomicMarket sales →{' '}
          <code className="text-emerald-400/80">detectWashTrades</code>. See
          POLICY.md.
        </p>
      </div>
    </div>
  );
}
