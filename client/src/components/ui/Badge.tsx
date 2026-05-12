import type { SeverityLevel } from "@blood-report/shared";

const severityClass: Record<SeverityLevel, string> = {
  normal: "severity-normal",
  high: "severity-high",
  low: "severity-low",
  critical: "severity-critical",
};

const severityLabel: Record<SeverityLevel, string> = {
  normal: "正常",
  high: "偏高",
  low: "偏低",
  critical: "危急",
};

export function Badge({ level, className = "" }: { level: SeverityLevel; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClass[level]} ${className}`}
    >
      {severityLabel[level]}
    </span>
  );
}

export function CountBadge({ count, level }: { count: number; level: SeverityLevel }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold ${severityClass[level]}`}
    >
      {count}
    </span>
  );
}
