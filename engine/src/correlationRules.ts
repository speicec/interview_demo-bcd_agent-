import type { Alert, IndicatorResult } from "@blood-report/shared";

type IndicatorMap = Record<string, IndicatorResult>;

function getLevel(map: IndicatorMap, code: string): string | undefined {
  return map[code]?.level;
}

function isAbnormalHigh(map: IndicatorMap, codes: string[]): boolean {
  return codes.every((c) => {
    const level = getLevel(map, c);
    return level === "high" || level === "critical";
  });
}

function isAbnormalLow(map: IndicatorMap, codes: string[]): boolean {
  return codes.every((c) => {
    const level = getLevel(map, c);
    return level === "low" || level === "critical";
  });
}

function anyAbnormalLow(map: IndicatorMap, codes: string[]): boolean {
  return codes.some((c) => {
    const level = getLevel(map, c);
    return level === "low" || level === "critical";
  });
}

/**
 * Detect multi-indicator correlation patterns.
 * Each rule checks a specific combination and returns an Alert if triggered.
 */
export function detectCorrelations(indicators: IndicatorResult[]): Alert[] {
  const map: IndicatorMap = {};
  for (const ind of indicators) {
    map[ind.code] = ind;
  }

  const alerts: Alert[] = [];

  // 1. Bacterial infection pattern: WBC ↑ + NEUT ↑
  if (isAbnormalHigh(map, ["WBC", "NEUT"])) {
    alerts.push({
      severity: "warn",
      title: "细菌性感染模式",
      description: "白细胞+中性粒细胞同时升高，符合细菌性感染典型表现。建议结合CRP和临床症状综合判断。",
      relatedIndicators: ["WBC", "NEUT"],
    });
  }

  // 2. Viral infection pattern: WBC ↓ + LYMPH ↑
  if (
    (getLevel(map, "WBC") === "low" || getLevel(map, "WBC") === "critical") &&
    (getLevel(map, "LYMPH") === "high" || getLevel(map, "LYMPH") === "critical")
  ) {
    alerts.push({
      severity: "warn",
      title: "病毒性感染模式",
      description: "白细胞减少+淋巴细胞升高，符合病毒性感染典型血象表现。",
      relatedIndicators: ["WBC", "LYMPH"],
    });
  }

  // 3. Microcytic hypochromic anemia: HGB ↓ + MCV ↓ + MCH ↓
  if (isAbnormalLow(map, ["HGB", "MCV", "MCH"])) {
    alerts.push({
      severity: "warn",
      title: "小细胞低色素性贫血",
      description: "血红蛋白降低伴MCV、MCH降低，符合小细胞低色素性贫血。常见于缺铁性贫血、地中海贫血。建议查铁蛋白、血清铁明确病因。",
      relatedIndicators: ["HGB", "MCV", "MCH"],
    });
  }

  // 4. Macrocytic anemia: HGB ↓ + MCV ↑
  if (
    anyAbnormalLow(map, ["HGB"]) &&
    (getLevel(map, "MCV") === "high" || getLevel(map, "MCV") === "critical")
  ) {
    alerts.push({
      severity: "warn",
      title: "大细胞性贫血",
      description: "血红蛋白降低伴MCV升高，符合大细胞性贫血。常见于叶酸/VitB12缺乏、肝病、酒精中毒。建议查血清叶酸和VitB12。",
      relatedIndicators: ["HGB", "MCV"],
    });
  }

  // 5. Normocytic anemia: HGB ↓ + MCV normal
  if (
    anyAbnormalLow(map, ["HGB"]) &&
    getLevel(map, "MCV") === "normal"
  ) {
    alerts.push({
      severity: "info",
      title: "正细胞性贫血",
      description: "血红蛋白降低但MCV正常，符合正细胞性贫血。常见于急性失血、溶血性贫血、慢性病贫血、肾性贫血。",
      relatedIndicators: ["HGB", "MCV"],
    });
  }

  // 6. Pancytopenia: WBC ↓ + HGB ↓ + PLT ↓
  if (isAbnormalLow(map, ["WBC", "HGB", "PLT"])) {
    const isCritical = ["WBC", "HGB", "PLT"].some(
      (c) => getLevel(map, c) === "critical"
    );
    alerts.push({
      severity: isCritical ? "critical" : "warn",
      title: "全血细胞减少（三系减少）",
      description: "白细胞、血红蛋白、血小板同时减少，需警惕骨髓抑制、再生障碍性贫血、骨髓增生异常综合征等。建议尽快行骨髓穿刺检查。",
      relatedIndicators: ["WBC", "HGB", "PLT"],
    });
  }

  // 7. Thrombocytopenia + coagulation abnormality
  if (
    anyAbnormalLow(map, ["PLT"]) &&
    (getLevel(map, "PT") === "high" || getLevel(map, "PT") === "critical" ||
     getLevel(map, "APTT") === "high" || getLevel(map, "APTT") === "critical")
  ) {
    alerts.push({
      severity: "critical",
      title: "血小板减少伴凝血功能异常",
      description: "血小板减少合并凝血时间延长，出血风险显著增加。需警惕DIC、严重肝病等，建议紧急就医。",
      relatedIndicators: ["PLT", "PT", "APTT"],
    });
  }

  // 8. Inflammation triad: WBC ↑ + CRP ↑ + ESR ↑
  if (
    isAbnormalHigh(map, ["WBC", "CRP"]) &&
    (getLevel(map, "ESR") === "high" || getLevel(map, "ESR") === "critical")
  ) {
    alerts.push({
      severity: "warn",
      title: "炎症三联征",
      description: "WBC+CRP+ESR同时升高，提示存在明确炎症反应。CRP显著升高（>50mg/L）提示细菌性感染可能性大。",
      relatedIndicators: ["WBC", "CRP", "ESR"],
    });
  }

  // 9. Iron deficiency anemia: HGB ↓ + MCV ↓ + RDWCV ↑
  if (
    anyAbnormalLow(map, ["HGB"]) &&
    (getLevel(map, "MCV") === "low" || getLevel(map, "MCV") === "critical") &&
    (getLevel(map, "RDWCV") === "high" || getLevel(map, "RDWCV") === "critical")
  ) {
    alerts.push({
      severity: "warn",
      title: "缺铁性贫血可能性大",
      description: "小细胞低色素性贫血伴RDW升高，高度提示缺铁性贫血。建议查血清铁蛋白、血清铁、TIBC明确诊断。",
      relatedIndicators: ["HGB", "MCV", "RDWCV"],
    });
  }

  return alerts;
}
