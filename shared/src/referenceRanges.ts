import type { IndicatorReference } from "./types.js";

/**
 * 2023 Chinese adult blood test reference ranges.
 * ~25 core indicators with gender/age adjustments where applicable.
 */
export const REFERENCE_RANGES: IndicatorReference[] = [
  // ── White Blood Cells ──
  {
    code: "WBC",
    name: "白细胞计数",
    unit: "×10⁹/L",
    defaultRange: { min: 3.5, max: 9.5 },
  },
  {
    code: "NEUT",
    name: "中性粒细胞绝对值",
    unit: "×10⁹/L",
    defaultRange: { min: 1.8, max: 6.3 },
  },
  {
    code: "NEUTP",
    name: "中性粒细胞百分比",
    unit: "%",
    defaultRange: { min: 40, max: 75 },
  },
  {
    code: "LYMPH",
    name: "淋巴细胞绝对值",
    unit: "×10⁹/L",
    defaultRange: { min: 1.1, max: 3.2 },
  },
  {
    code: "LYMPHP",
    name: "淋巴细胞百分比",
    unit: "%",
    defaultRange: { min: 20, max: 50 },
  },
  {
    code: "MONO",
    name: "单核细胞绝对值",
    unit: "×10⁹/L",
    defaultRange: { min: 0.1, max: 0.6 },
  },
  {
    code: "EO",
    name: "嗜酸性粒细胞绝对值",
    unit: "×10⁹/L",
    defaultRange: { min: 0.02, max: 0.52 },
  },
  {
    code: "BASO",
    name: "嗜碱性粒细胞绝对值",
    unit: "×10⁹/L",
    defaultRange: { min: 0, max: 0.06 },
  },

  // ── Red Blood Cells ──
  {
    code: "RBC",
    name: "红细胞计数",
    unit: "×10¹²/L",
    defaultRange: { min: 4.3, max: 5.8 },
    maleRange: { min: 4.3, max: 5.8 },
    femaleRange: { min: 3.8, max: 5.1 },
  },
  {
    code: "HGB",
    name: "血红蛋白",
    unit: "g/L",
    defaultRange: { min: 130, max: 175 },
    maleRange: { min: 130, max: 175 },
    femaleRange: { min: 115, max: 150 },
  },
  {
    code: "HCT",
    name: "红细胞比容",
    unit: "%",
    defaultRange: { min: 40, max: 50 },
    maleRange: { min: 40, max: 50 },
    femaleRange: { min: 35, max: 45 },
  },
  {
    code: "MCV",
    name: "平均红细胞体积",
    unit: "fL",
    defaultRange: { min: 82, max: 100 },
  },
  {
    code: "MCH",
    name: "平均红细胞血红蛋白量",
    unit: "pg",
    defaultRange: { min: 27, max: 34 },
  },
  {
    code: "MCHC",
    name: "平均红细胞血红蛋白浓度",
    unit: "g/L",
    defaultRange: { min: 316, max: 354 },
  },
  {
    code: "RDWCV",
    name: "红细胞分布宽度CV",
    unit: "%",
    defaultRange: { min: 11.5, max: 14.5 },
  },

  // ── Platelets ──
  {
    code: "PLT",
    name: "血小板计数",
    unit: "×10⁹/L",
    defaultRange: { min: 125, max: 350 },
  },
  {
    code: "MPV",
    name: "平均血小板体积",
    unit: "fL",
    defaultRange: { min: 9, max: 13 },
  },
  {
    code: "PCT",
    name: "血小板比容",
    unit: "%",
    defaultRange: { min: 0.17, max: 0.35 },
  },
  {
    code: "PDW",
    name: "血小板分布宽度",
    unit: "%",
    defaultRange: { min: 9, max: 17 },
  },

  // ── Coagulation ──
  {
    code: "PT",
    name: "凝血酶原时间",
    unit: "s",
    defaultRange: { min: 9.6, max: 12.8 },
  },
  {
    code: "APTT",
    name: "活化部分凝血活酶时间",
    unit: "s",
    defaultRange: { min: 24.8, max: 33.8 },
  },
  {
    code: "FIB",
    name: "纤维蛋白原",
    unit: "g/L",
    defaultRange: { min: 2.0, max: 4.0 },
  },
  {
    code: "DD",
    name: "D-二聚体",
    unit: "mg/L",
    defaultRange: { min: 0, max: 0.5 },
    ageOverrides: {
      "60": { min: 0, max: 1.0 },
    },
  },

  // ── Bone Marrow / Other ──
  {
    code: "RET",
    name: "网织红细胞百分比",
    unit: "%",
    defaultRange: { min: 0.5, max: 1.5 },
  },
  {
    code: "ESR",
    name: "血沉",
    unit: "mm/h",
    defaultRange: { min: 0, max: 15 },
    maleRange: { min: 0, max: 15 },
    femaleRange: { min: 0, max: 20 },
  },
  {
    code: "CRP",
    name: "C反应蛋白",
    unit: "mg/L",
    defaultRange: { min: 0, max: 5 },
  },
];

/** Lookup map: indicator code → reference range entry */
export const REFERENCE_MAP: Record<string, IndicatorReference> = {};
for (const ref of REFERENCE_RANGES) {
  REFERENCE_MAP[ref.code] = ref;
}
