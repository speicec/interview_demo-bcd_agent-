import type { IndicatorResult, Alert } from "@blood-report/shared";
import { Badge } from "./ui/Badge";

type SeverityGroups = {
  critical: IndicatorResult[];
  high: IndicatorResult[];
  low: IndicatorResult[];
};

function groupBySeverity(indicators: IndicatorResult[]): SeverityGroups {
  const groups: SeverityGroups = { critical: [], high: [], low: [] };
  for (const ind of indicators) {
    if (ind.level === "normal") continue;
    groups[ind.level]?.push(ind);
  }
  return groups;
}

export function AbnormalSummary({
  indicators,
  alerts,
}: {
  indicators: IndicatorResult[];
  alerts: Alert[];
}) {
  const groups = groupBySeverity(indicators);

  return (
    <div className="space-y-4">
      {/* Summary counts */}
      <div className="flex gap-3 flex-wrap">
        <SummaryStat label="危急" count={groups.critical.length} className="text-danger bg-danger/[0.06]" />
        <SummaryStat label="偏高" count={groups.high.length} className="text-warn bg-warn/[0.06]" />
        <SummaryStat label="偏低" count={groups.low.length} className="text-info bg-info/[0.06]" />
        <SummaryStat label="正常" count={indicators.filter((i) => i.level === "normal").length} className="text-safe bg-safe/[0.06]" />
      </div>

      {/* Correlation alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="serif-title text-sm font-bold text-muted-foreground">关联预警</h4>
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`border-l-4 p-3 ${
                alert.severity === "critical"
                  ? "border-l-danger-500 bg-danger-50"
                  : alert.severity === "warn"
                    ? "border-l-warn-500 bg-warn-50"
                    : "border-l-info-500 bg-info-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold ${
                    alert.severity === "critical"
                      ? "text-danger-600"
                      : alert.severity === "warn"
                        ? "text-warn-600"
                        : "text-info-600"
                  }`}
                >
                  {alert.title}
                </span>
                {alert.severity === "critical" && (
                  <Badge level="critical" />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Abnormal indicator details */}
      {groups.critical.length > 0 && (
        <AbnormalSection title="危急指标" items={groups.critical} />
      )}
      {groups.high.length > 0 && (
        <AbnormalSection title="偏高指标" items={groups.high} />
      )}
      {groups.low.length > 0 && (
        <AbnormalSection title="偏低指标" items={groups.low} />
      )}

      {groups.critical.length === 0 && groups.high.length === 0 && groups.low.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-safe-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          所有指标均在正常范围内
        </div>
      )}
    </div>
  );
}

function SummaryStat({
  label,
  count,
  className,
}: {
  label: string;
  count: number;
  className: string;
}) {
  return (
    <div className={`rounded-sm px-4 py-2 text-center min-w-[72px] border ${className}`}>
      <div className="text-xl font-bold">{count}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}

function AbnormalSection({ title, items }: { title: string; items: IndicatorResult[] }) {
  return (
    <div>
      <h4 className="serif-title text-sm font-bold text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-1.5">
        {items.map((ind) => (
          <div key={ind.code} className="flex items-start justify-between gap-3 bg-secondary/30 rounded-sm px-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-800">{ind.name}</div>
              {ind.interpretation && (
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ind.interpretation}</div>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-semibold text-gray-800">{ind.value}</span>
              <span className="text-xs text-gray-400 ml-1">{ind.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
