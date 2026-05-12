import type { IndicatorInput, IndicatorResult, PatientInfo, SeverityLevel } from "@blood-report/shared";
import { REFERENCE_MAP } from "@blood-report/shared";
import { getReferenceRange } from "./referenceLookup.js";

/**
 * Determine severity level by comparing value to reference range.
 *
 * Thresholds:
 *  - normal:   within [min, max]
 *  - high:     above max, but ≤ 1.5× max
 *  - critical: > 1.5× max  OR  < 0.5× min
 *  - low:      below min, but ≥ 0.5× min
 */
export function classifyLevel(value: number, ref: { min: number; max: number }): SeverityLevel {
  if (value >= ref.min && value <= ref.max) {
    return "normal";
  }
  if (value > ref.max) {
    if (value > ref.max * 1.5) {
      return "critical";
    }
    return "high";
  }
  // value < ref.min
  if (value < ref.min * 0.5) {
    return "critical";
  }
  return "low";
}

export function analyzeIndicator(
  indicator: IndicatorInput,
  patient?: PatientInfo
): IndicatorResult {
  const refRange = getReferenceRange(indicator, patient);
  const level = classifyLevel(indicator.value, refRange);
  const ref = REFERENCE_MAP[indicator.code];
  const name = indicator.name ?? ref?.name ?? indicator.code;

  return {
    code: indicator.code,
    name,
    value: indicator.value,
    unit: indicator.unit,
    refRange,
    level,
    interpretation: "",
  };
}
