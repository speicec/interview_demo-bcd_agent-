import { cn } from "../../lib/utils";
import type { SeverityLevel } from "@blood-report/shared";

const severityClass: Record<SeverityLevel, string> = {
  normal: "indicator-normal",
  high: "indicator-high",
  low: "indicator-low",
  critical: "indicator-critical",
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
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium",
        severityClass[level],
        className
      )}
    >
      {severityLabel[level]}
    </span>
  );
}

export function CountBadge({ count, level }: { count: number; level: SeverityLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold",
        severityClass[level]
      )}
    >
      {count}
    </span>
  );
}
