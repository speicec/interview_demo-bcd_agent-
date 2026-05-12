import type { SeverityLevel } from "./types.js";

/** Display labels for each severity level */
export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  normal: "正常",
  high: "偏高",
  low: "偏低",
  critical: "危急",
};

/** Display order for sorting (critical first) */
export const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  critical: 0,
  high: 1,
  low: 2,
  normal: 3,
};

/** Unit display name mappings */
export const UNIT_DISPLAY: Record<string, string> = {
  "×10⁹/L": "×10⁹/L",
  "%": "%",
  "×10¹²/L": "×10¹²/L",
  "g/L": "g/L",
  fL: "fL",
  pg: "pg",
  s: "s",
  "mm/h": "mm/h",
  "mg/L": "mg/L",
};

/** All known indicator codes */
export const INDICATOR_CODES = [
  "WBC", "NEUT", "NEUTP", "LYMPH", "LYMPHP", "MONO", "EO", "BASO",
  "RBC", "HGB", "HCT", "MCV", "MCH", "MCHC", "RDWCV",
  "PLT", "MPV", "PCT", "PDW",
  "PT", "APTT", "FIB", "DD",
  "RET", "ESR", "CRP",
] as const;

export type IndicatorCode = (typeof INDICATOR_CODES)[number];
