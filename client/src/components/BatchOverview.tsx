import type { AnalysisResult } from "@blood-report/shared";

export function BatchOverview({ results }: { results: AnalysisResult[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              报告
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              正常
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              异常
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              危急
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              预警
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
              <td className="py-2 px-3 font-medium text-gray-800 text-xs">
                {r.reportId ?? `报告 ${i + 1}`}
              </td>
              <td className="py-2 px-3 text-center">
                <span className="text-safe-600 font-semibold">{r.summary.normal}</span>
              </td>
              <td className="py-2 px-3 text-center">
                <span className={`${r.summary.abnormal > 0 ? "text-warn-600 font-semibold" : "text-gray-400"}`}>
                  {r.summary.abnormal}
                </span>
              </td>
              <td className="py-2 px-3 text-center">
                {r.summary.criticalCount > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold bg-danger-100 text-danger-600">
                    {r.summary.criticalCount}
                  </span>
                ) : (
                  <span className="text-gray-300">0</span>
                )}
              </td>
              <td className="py-2 px-3">
                {r.alerts.length > 0 ? (
                  <span className="text-xs text-gray-600">
                    {r.alerts.map((a) => a.title).join("、")}
                  </span>
                ) : (
                  <span className="text-xs text-gray-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
