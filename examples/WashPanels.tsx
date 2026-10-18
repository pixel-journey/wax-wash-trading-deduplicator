"use client";

import type { WashCleanResult } from "./types";

export function WashSummary({
  result,
  className = "",
}: {
  result: WashCleanResult;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/30 p-6 ${className}`}
    >
      <h3 className="text-sm text-white/50 uppercase tracking-wider mb-4">
        Volume comparison
      </h3>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-white/50 text-xs">Raw volume</dt>
          <dd className="font-mono text-xl">{result.rawVolume.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-white/50 text-xs">Clean volume</dt>
          <dd className="font-mono text-xl text-emerald-400">
            {result.cleanVolume.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-white/50 text-xs">Removed</dt>
          <dd className="font-mono text-amber-400">
            {result.removedVolume.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-white/50 text-xs">Sales kept</dt>
          <dd className="font-mono">
            {result.cleanSales.length}/{result.inputCount}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        {result.methodologyNote}
      </p>
    </section>
  );
}

export function WashFlagList({
  result,
  className = "",
}: {
  result: WashCleanResult;
  className?: string;
}) {
  if (result.flags.length === 0) {
    return (
      <p className={`text-sm text-white/50 ${className}`}>
        No wash flags on this set.
      </p>
    );
  }
  return (
    <ul className={`space-y-2 ${className}`}>
      {result.flags.map((f) => (
        <li
          key={f.id}
          className={`rounded-xl border p-3 text-sm ${
            f.severity === "alert"
              ? "border-red-500/30 bg-red-500/10 text-red-100"
              : f.severity === "warn"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                : "border-white/10 bg-white/5 text-white/80"
          }`}
        >
          <span className="text-xs uppercase opacity-70">{f.kind}</span>
          <p className="mt-1">{f.message}</p>
        </li>
      ))}
    </ul>
  );
}
