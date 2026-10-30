import type { WashCleanResult } from "./types";

function esc(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportFlagsCsv(result: WashCleanResult): string {
  const header = ["flagId", "kind", "severity", "saleIds", "message"].join(",");
  const rows = result.flags.map((f) =>
    [
      esc(f.id),
      f.kind,
      f.severity,
      esc(f.saleIds.join(";")),
      esc(f.message),
    ].join(",")
  );
  return [header, ...rows].join("\n") + "\n";
}

export function exportSummaryMarkdown(result: WashCleanResult): string {
  return [
    `# Wash analysis summary`,
    ``,
    `> Heuristics only — educational reference`,
    ``,
    `- Input sales: ${result.inputCount}`,
    `- Clean sales: ${result.cleanSales.length}`,
    `- Raw volume: ${result.rawVolume.toFixed(4)}`,
    `- Clean volume: ${result.cleanVolume.toFixed(4)}`,
    `- Removed volume: ${result.removedVolume.toFixed(4)}`,
    `- Flags: ${result.flags.length}`,
    ``,
    result.methodologyNote,
    ``,
  ].join("\n");
}

export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
