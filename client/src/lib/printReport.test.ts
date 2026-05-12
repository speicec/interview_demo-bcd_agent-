import { describe, it, expect } from "vitest";
import { buildPrintHTML } from "./printReport";
import type { AnalysisResult } from "@blood-report/shared";

const mockResult: AnalysisResult = {
  reportId: "TEST-001",
  analyzedAt: "2026-05-12T10:00:00Z",
  patient: { gender: "male", age: 35 },
  indicators: [
    {
      code: "WBC",
      name: "白细胞计数",
      value: 12.5,
      unit: "×10⁹/L",
      refRange: { min: 3.5, max: 9.5 },
      level: "high",
      interpretation: "",
    },
    {
      code: "RBC",
      name: "红细胞计数",
      value: 5.1,
      unit: "×10¹²/L",
      refRange: { min: 4.3, max: 5.8 },
      level: "normal",
      interpretation: "",
    },
  ],
  alerts: [
    {
      severity: "warn",
      title: "WBC 升高",
      description: "白细胞计数超出参考范围上限",
      relatedIndicators: ["WBC"],
    },
  ],
  summary: { total: 2, normal: 1, abnormal: 1, criticalCount: 0 },
};

describe("buildPrintHTML", () => {
  it("contains page title 临床检验报告", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("临床检验报告");
  });

  it("contains A4 print style", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("size: A4");
    expect(html).toContain("@media print");
  });

  it("contains report ID and date", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("TEST-001");
    expect(html).toContain("2026-05-12");
  });

  it("contains indicator codes", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("WBC");
    expect(html).toContain("RBC");
  });

  it("contains alert title", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("WBC 升高");
  });

  it("contains summary counts", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain(">1<");
    expect(html).toContain(">1<");
  });

  it("contains patient info", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("35");
    expect(html).toContain("男");
  });
});
