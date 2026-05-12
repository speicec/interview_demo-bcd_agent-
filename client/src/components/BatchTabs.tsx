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
    <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
      {results.map((result, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            i === activeIndex
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
