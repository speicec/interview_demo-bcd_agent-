import { describe, it, expect } from "vitest";
import { analyzeReport, classifyLevel, getReferenceRange, detectCorrelations } from "./index.js";
import type { BloodReport, IndicatorInput, IndicatorResult } from "@blood-report/shared";

// ── classifyLevel ──

describe("classifyLevel", () => {
  const ref = { min: 3.5, max: 9.5 }; // WBC

  it("returns normal when value is within range", () => {
    expect(classifyLevel(6.5, ref)).toBe("normal");
  });

  it("returns normal at exact lower bound", () => {
    expect(classifyLevel(3.5, ref)).toBe("normal");
  });

  it("returns normal at exact upper bound", () => {
    expect(classifyLevel(9.5, ref)).toBe("normal");
  });

  it("returns high when mildly elevated (< 1.5x max)", () => {
    expect(classifyLevel(12.0, ref)).toBe("high");
  });

  it("returns critical when severely elevated (> 1.5x max)", () => {
    expect(classifyLevel(30.0, ref)).toBe("critical");
  });

  it("returns low when mildly below range (> 0.5x min)", () => {
    expect(classifyLevel(2.5, ref)).toBe("low");
  });

  it("returns critical when severely low (< 0.5x min)", () => {
    expect(classifyLevel(1.0, ref)).toBe("critical");
  });
});

// ── getReferenceRange ──

describe("getReferenceRange", () => {
  it("returns default range without patient info", () => {
    const ind: IndicatorInput = { code: "WBC", value: 6.5, unit: "×10⁹/L" };
    expect(getReferenceRange(ind)).toEqual({ min: 3.5, max: 9.5 });
  });

  it("returns male range for HGB with male patient", () => {
    const ind: IndicatorInput = { code: "HGB", value: 125, unit: "g/L" };
    expect(getReferenceRange(ind, { gender: "male" })).toEqual({ min: 130, max: 175 });
  });

  it("returns female range for HGB with female patient", () => {
    const ind: IndicatorInput = { code: "HGB", value: 125, unit: "g/L" };
    expect(getReferenceRange(ind, { gender: "female" })).toEqual({ min: 115, max: 150 });
  });

  it("returns user-provided refRange override", () => {
    const ind: IndicatorInput = {
      code: "WBC",
      value: 6.5,
      unit: "×10⁹/L",
      refRange: { min: 4.0, max: 10.0 },
    };
    expect(getReferenceRange(ind)).toEqual({ min: 4.0, max: 10.0 });
  });

  it("applies age override for D-Dimer at age 65", () => {
    const ind: IndicatorInput = { code: "DD", value: 0.8, unit: "mg/L" };
    expect(getReferenceRange(ind, { age: 65 })).toEqual({ min: 0, max: 1.0 });
  });
});

// ── analyzeReport ──

describe("analyzeReport", () => {
  it("correctly analyzes a normal WBC", () => {
    const report: BloodReport = {
      reportId: "test-1",
      indicators: [{ code: "WBC", value: 6.5, unit: "×10⁹/L" }],
    };
    const result = analyzeReport(report);
    expect(result.indicators[0].level).toBe("normal");
    expect(result.summary.total).toBe(1);
    expect(result.summary.normal).toBe(1);
    expect(result.summary.abnormal).toBe(0);
  });

  it("correctly analyzes a critically low HGB (50 g/L, male)", () => {
    const report: BloodReport = {
      reportId: "test-2",
      patient: { gender: "male", age: 40 },
      indicators: [{ code: "HGB", value: 50, unit: "g/L" }],
    };
    const result = analyzeReport(report);
    expect(result.indicators[0].level).toBe("critical");
    expect(result.summary.criticalCount).toBe(1);
  });

  it("flags bacterial infection when WBC + NEUT both elevated", () => {
    const report: BloodReport = {
      reportId: "test-3",
      indicators: [
        { code: "WBC", value: 15, unit: "×10⁹/L" },
        { code: "NEUT", value: 10, unit: "×10⁹/L" },
      ],
    };
    const result = analyzeReport(report);
    const infectionAlert = result.alerts.find((a) => a.title.includes("细菌性感染"));
    expect(infectionAlert).toBeDefined();
  });

  it("detects microcytic hypochromic anemia pattern", () => {
    const report: BloodReport = {
      reportId: "test-4",
      patient: { gender: "female", age: 30 },
      indicators: [
        { code: "HGB", value: 80, unit: "g/L" },
        { code: "MCV", value: 68, unit: "fL" },
        { code: "MCH", value: 22, unit: "pg" },
      ],
    };
    const result = analyzeReport(report);
    const anemiaAlert = result.alerts.find((a) => a.title.includes("小细胞低色素性贫血"));
    expect(anemiaAlert).toBeDefined();
  });

  it("detects pancytopenia when all three lineages are low", () => {
    const report: BloodReport = {
      reportId: "test-5",
      indicators: [
        { code: "WBC", value: 2.0, unit: "×10⁹/L" },
        { code: "HGB", value: 80, unit: "g/L" },
        { code: "PLT", value: 50, unit: "×10⁹/L" },
      ],
    };
    const result = analyzeReport(report);
    const panAlert = result.alerts.find((a) => a.title.includes("全血细胞减少"));
    expect(panAlert).toBeDefined();
    expect(panAlert!.severity).toBe("critical");
  });

  it("generates interpretation text for abnormal indicators", () => {
    const report: BloodReport = {
      reportId: "test-6",
      indicators: [{ code: "WBC", value: 15, unit: "×10⁹/L" }],
    };
    const result = analyzeReport(report);
    expect(result.indicators[0].interpretation).toContain("白细胞");
  });

  it("returns empty interpretation for normal indicators", () => {
    const report: BloodReport = {
      reportId: "test-7",
      indicators: [{ code: "WBC", value: 6.5, unit: "×10⁹/L" }],
    };
    const result = analyzeReport(report);
    expect(result.indicators[0].interpretation).toBe("");
  });

  it("sorts critical before high/low before normal in summary counts", () => {
    const report: BloodReport = {
      reportId: "test-8",
      patient: { gender: "male" },
      indicators: [
        { code: "WBC", value: 6.0, unit: "×10⁹/L" },
        { code: "HGB", value: 50, unit: "g/L" },    // critical low (< 0.5 × 130)
        { code: "PLT", value: 200, unit: "×10⁹/L" },
        { code: "CRP", value: 7, unit: "mg/L" },     // high (not critical)
      ],
    };
    const result = analyzeReport(report);
    expect(result.summary.total).toBe(4);
    expect(result.summary.normal).toBe(2);
    expect(result.summary.abnormal).toBe(2);
    expect(result.summary.criticalCount).toBe(1);
  });
});

// ── detectCorrelations ──

describe("detectCorrelations", () => {
  it("returns empty array when no patterns match", () => {
    const indicators: IndicatorResult[] = [
      { code: "WBC", name: "白细胞", value: 6.5, unit: "×10⁹/L", refRange: { min: 3.5, max: 9.5 }, level: "normal", interpretation: "" },
    ];
    expect(detectCorrelations(indicators)).toEqual([]);
  });
});
