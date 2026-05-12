/** Valid demo blood report for quick testing */
export const SAMPLE_REPORT = {
  reportId: "DEMO-20250101-001",
  patient: {
    gender: "male",
    age: 35,
  },
  indicators: [
    { code: "WBC", value: 12.5, unit: "×10⁹/L" },
    { code: "NEUT", value: 9.2, unit: "×10⁹/L" },
    { code: "NEUTP", value: 78, unit: "%" },
    { code: "LYMPH", value: 1.8, unit: "×10⁹/L" },
    { code: "LYMPHP", value: 16, unit: "%" },
    { code: "MONO", value: 0.5, unit: "×10⁹/L" },
    { code: "EO", value: 0.1, unit: "×10⁹/L" },
    { code: "BASO", value: 0.02, unit: "×10⁹/L" },
    { code: "RBC", value: 5.1, unit: "×10¹²/L" },
    { code: "HGB", value: 148, unit: "g/L" },
    { code: "HCT", value: 44, unit: "%" },
    { code: "MCV", value: 86, unit: "fL" },
    { code: "MCH", value: 29, unit: "pg" },
    { code: "MCHC", value: 336, unit: "g/L" },
    { code: "RDWCV", value: 12.8, unit: "%" },
    { code: "PLT", value: 280, unit: "×10⁹/L" },
    { code: "MPV", value: 10.5, unit: "fL" },
    { code: "CRP", value: 45, unit: "mg/L" },
  ],
};
