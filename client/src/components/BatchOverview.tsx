import type { AnalysisResult } from "@blood-report/shared";

export function BatchOverview({ results }: { results: AnalysisResult[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide font-serif">
              报告
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide font-serif">
              正常
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide font-serif">
              异常
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide font-serif">
              危急
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground tracking-wide font-serif">
              预警
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b border-border hover:bg-secondary/50">
              <td className="py-2 px-3 font-medium text-gray-800 text-xs">
                {r.reportId ?? `报告 ${i + 1}`}
              </td>
              <td className="py-2 px-3 text-center">
                <span className="text-safe font-semibold">{r.summary.normal}</span>
              </td>
              <td className="py-2 px-3 text-center">
                <span className={`${r.summary.abnormal > 0 ? "text-warn font-semibold" : "text-muted-foreground"}`}>
                  {r.summary.abnormal}
                </span>
              </td>
              <td className="py-2 px-3 text-center">
                {r.summary.criticalCount > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold bg-danger/[0.08] text-danger">
                    {r.summary.criticalCount}
                  </span>
                ) : (
                  <span className="text-muted-foreground/50">0</span>
                )}
              </td>
              <td className="py-2 px-3">
                {r.alerts.length > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    {r.alerts.map((a) => a.title).join("、")}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
