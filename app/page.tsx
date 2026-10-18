'use client';

import React, { useMemo, useState } from 'react';
import {
  demoCleanSales,
  demoSalesWithWash,
  detectWashTrades,
} from '../examples/engines';

type Mode = 'wash' | 'clean';

export default function WashTradingDeduplicator() {
  const [mode, setMode] = useState<Mode>('wash');
  const result = useMemo(
    () =>
      detectWashTrades(
        mode === 'wash' ? demoSalesWithWash() : demoCleanSales()
      ),
    [mode]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          WASH TRADING DEDUPLICATOR
        </div>
        <div className="text-xs opacity-60 mb-6">
          Pixel Journey · Soft heuristics · Not regulatory findings
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('wash')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'wash' ? 'bg-amber-600' : 'bg-white/10'
            }`}
          >
            Demo with wash patterns
          </button>
          <button
            type="button"
            onClick={() => setMode('clean')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'clean' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo clean sales
          </button>
        </div>

        <div className="border border-white/10 bg-black/40 p-6 rounded-2xl mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <div className="opacity-50 text-xs">Raw volume</div>
              <div className="font-mono text-xl">{result.rawVolume.toFixed(2)}</div>
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

        <p className="text-xs opacity-60">
          Map AtomicMarket sales into <code className="text-emerald-400/80">SaleEvent</code>{' '}
          and call <code className="text-emerald-400/80">detectWashTrades</code>.
        </p>
      </div>
    </div>
  );
}
