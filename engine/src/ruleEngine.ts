import type { AnalysisResult, BloodReport, IndicatorResult } from "@blood-report/shared";
import { analyzeIndicator } from "./indicatorAnalyzer.js";
import { generateInterpretation } from "./interpretationRules.js";
import { detectCorrelations } from "./correlationRules.js";

/**
 * Main rule engine orchestrator.
 * Input: BloodReport → Output: AnalysisResult
 */
export function analyzeReport(report: BloodReport): AnalysisResult {
  const patient = report.patient;

  // Step 1: Analyze each indicator
  const results: IndicatorResult[] = report.indicators.map((ind) => {
    const result = analyzeIndicator(ind, patient);
    result.interpretation = generateInterpretation(result);
    return result;
  });

  // Step 2: Multi-indicator correlation detection
  const alerts = detectCorrelations(results);

  // Step 3: Summary
  const normal = results.filter((r) => r.level === "normal").length;
  const criticalCount = results.filter((r) => r.level === "critical").length;
  const total = results.length;

  return {
    reportId: report.reportId ?? `report-${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    patient,
    indicators: results,
    alerts,
    summary: {
      total,
      normal,
      abnormal: total - normal,
      criticalCount,
    },
  };
}
