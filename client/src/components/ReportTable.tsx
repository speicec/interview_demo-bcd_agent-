import type { IndicatorResult } from "@blood-report/shared";
import { Badge } from "./ui/Badge";

export function ReportTable({ indicators }: { indicators: IndicatorResult[] }) {
  const sorted = [...indicators].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, low: 2, normal: 3 };
    return (order[a.level] ?? 3) - (order[b.level] ?? 3);
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              指标
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              结果
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              参考范围
            </th>
            <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              判定
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ind) => (
            <tr
              key={ind.code}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-2.5 px-3">
                <div className="font-medium text-gray-800">{ind.name}</div>
                <div className="text-xs text-gray-400 font-mono">{ind.code}</div>
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                <span
                  className={
                    ind.level === "critical"
                      ? "text-danger-600 font-bold"
                      : ind.level !== "normal"
                        ? "text-gray-800 font-medium"
                        : "text-gray-600"
                  }
                >
                  {ind.value}
                </span>
                <span className="text-gray-400 ml-1 text-xs">{ind.unit}</span>
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 tabular-nums text-xs">
                {ind.refRange.min} – {ind.refRange.max}
              </td>
              <td className="py-2.5 px-3 text-center">
                <Badge level={ind.level} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
