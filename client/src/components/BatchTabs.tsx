import type { AnalysisResult } from "@blood-report/shared";
import { CountBadge } from "./ui/Badge";

export function BatchTabs({
  results,
  activeIndex,
  onChange,
}: {
  results: AnalysisResult[];
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-border overflow-x-auto">
      {results.map((result, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            i === activeIndex
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          {result.reportId || `报告 ${i + 1}`}
          {result.summary.criticalCount > 0 && (
            <CountBadge count={result.summary.criticalCount} level="critical" />
          )}
        </button>
      ))}
    </div>
  );
}
