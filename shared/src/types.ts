// ── Enums ──

export type SeverityLevel = "normal" | "high" | "low" | "critical";

export type Gender = "male" | "female";

export type AlertSeverity = "info" | "warn" | "critical";

// ── Core Domain ──

export interface PatientInfo {
  gender?: Gender;
  age?: number;
}

export interface ReferenceRange {
  min: number;
  max: number;
}

/** Per-indicator reference range with optional gender/age overrides */
export interface IndicatorReference {
  code: string;
  name: string;
  unit: string;
  defaultRange: ReferenceRange;
  /** Gender-specific overrides */
  maleRange?: ReferenceRange;
  femaleRange?: ReferenceRange;
  /** Age-specific overrides (keyed by age threshold, e.g. "60") */
  ageOverrides?: Record<string, ReferenceRange>;
}

export interface IndicatorInput {
  code: string;
  name?: string;
  value: number;
  unit: string;
  /** User-provided override for reference range */
  refRange?: ReferenceRange;
}

export interface BloodReport {
  reportId?: string;
  patient?: PatientInfo;
  indicators: IndicatorInput[];
}

// ── Analysis Output ──

export interface IndicatorResult {
  code: string;
  name: string;
  value: number;
  unit: string;
  refRange: ReferenceRange;
  level: SeverityLevel;
  interpretation: string;
}

export interface Alert {
  severity: AlertSeverity;
  title: string;
  description: string;
  relatedIndicators: string[];
}

export interface AnalysisResult {
  reportId: string;
  analyzedAt: string;
  patient?: PatientInfo;
  indicators: IndicatorResult[];
  alerts: Alert[];
  summary: {
    total: number;
    normal: number;
    abnormal: number;
    criticalCount: number;
  };
}

// ── Chat ──

export interface ChatRequest {
  chatId: string;
  message: string;
  reportContext?: AnalysisResult;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}
