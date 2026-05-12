import type { IndicatorInput, PatientInfo, ReferenceRange } from "@blood-report/shared";
import { REFERENCE_MAP } from "@blood-report/shared";

/**
 * Look up the appropriate reference range for an indicator,
 * applying gender and age corrections when available.
 */
export function getReferenceRange(
  indicator: IndicatorInput,
  patient?: PatientInfo
): ReferenceRange {
  // User-provided override takes priority
  if (indicator.refRange) {
    return indicator.refRange;
  }

  const ref = REFERENCE_MAP[indicator.code];
  if (!ref) {
    // Unknown indicator — return a broad fallback range
    return { min: 0, max: 9999 };
  }

  // Check gender-specific overrides
  if (patient?.gender) {
    if (patient.gender === "male" && ref.maleRange) {
      return ref.maleRange;
    }
    if (patient.gender === "female" && ref.femaleRange) {
      return ref.femaleRange;
    }
  }

  // Check age-specific overrides (find highest threshold <= patient age)
  if (patient?.age && ref.ageOverrides) {
    const thresholds = Object.keys(ref.ageOverrides)
      .map(Number)
      .sort((a, b) => b - a);
    for (const threshold of thresholds) {
      if (patient.age >= threshold) {
        return ref.ageOverrides[String(threshold)];
      }
    }
  }

  return ref.defaultRange;
}
