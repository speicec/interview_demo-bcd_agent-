import type { IndicatorResult, SeverityLevel } from "@blood-report/shared";

/**
 * Clinical interpretation text templates keyed by indicator code + severity level.
 * Only abnormal levels have interpretations; normal returns empty string.
 */
const INTERPRETATIONS: Record<string, Record<SeverityLevel, string>> = {
  WBC: {
    normal: "",
    high: "白细胞升高常见于细菌感染、炎症、组织损伤等。剧烈运动、妊娠、情绪激动也可引起生理性升高。",
    low: "白细胞减少可见于病毒感染、某些药物影响、放射线损伤、脾功能亢进等。",
    critical: "白细胞显著异常，需紧急就医排查严重感染、血液系统疾病或骨髓抑制。",
  },
  NEUT: {
    normal: "",
    high: "中性粒细胞升高常见于细菌性感染、急性炎症、组织坏死等。",
    low: "中性粒细胞减少可见于病毒感染、药物反应、再生障碍性贫血等。",
    critical: "中性粒细胞显著异常，需警惕严重感染或血液系统疾病。",
  },
  NEUTP: {
    normal: "",
    high: "中性粒细胞百分比升高意义同中性粒细胞绝对值升高，常见于细菌感染。",
    low: "中性粒细胞百分比降低可见于病毒感染、淋巴细胞增多症等。",
    critical: "中性粒细胞百分比显著异常，需结合绝对值综合判断。",
  },
  LYMPH: {
    normal: "",
    high: "淋巴细胞升高常见于病毒感染（如流感、EB病毒）、百日咳、淋巴细胞白血病等。",
    low: "淋巴细胞减少可见于免疫缺陷状态、应用糖皮质激素后、应激状态等。",
    critical: "淋巴细胞显著异常，需警惕淋巴细胞增生性疾病或严重免疫缺陷。",
  },
  LYMPHP: {
    normal: "",
    high: "淋巴细胞百分比升高常见于病毒感染恢复期、慢性感染等。",
    low: "淋巴细胞百分比降低可见于急性细菌感染期（中性粒细胞主导反应）。",
    critical: "淋巴细胞百分比显著异常，需结合绝对值综合判断。",
  },
  MONO: {
    normal: "",
    high: "单核细胞升高可见于某些感染（结核、伤寒）、恢复期骨髓造血、单核细胞白血病等。",
    low: "单核细胞减少临床意义相对较小，可见于再生障碍性贫血等。",
    critical: "单核细胞显著升高需警惕单核细胞白血病或严重慢性感染。",
  },
  EO: {
    normal: "",
    high: "嗜酸性粒细胞升高常见于过敏性疾病（哮喘、荨麻疹）、寄生虫感染、某些皮肤病等。",
    low: "嗜酸性粒细胞减少可见于应激状态、应用糖皮质激素后。",
    critical: "嗜酸性粒细胞显著升高需警惕嗜酸性粒细胞白血病或严重过敏反应。",
  },
  BASO: {
    normal: "",
    high: "嗜碱性粒细胞升高可见于慢性粒细胞白血病、真性红细胞增多症、过敏反应等。",
    low: "嗜碱性粒细胞减少临床意义较小。",
    critical: "嗜碱性粒细胞显著升高需警惕骨髓增生性肿瘤。",
  },
  RBC: {
    normal: "",
    high: "红细胞升高可见于脱水（相对性增多）、真性红细胞增多症、慢性缺氧（高原、COPD）等。",
    low: "红细胞减少提示贫血，需结合血红蛋白和MCV综合判断贫血类型。",
    critical: "红细胞显著减少提示严重贫血，需紧急就医。",
  },
  HGB: {
    normal: "",
    high: "血红蛋白升高可见于脱水、真性红细胞增多症、慢性缺氧状态等。",
    low: "血红蛋白降低提示贫血，常见原因包括缺铁、失血、溶血、营养不良等。",
    critical: "血红蛋白严重降低提示重度贫血，需紧急就医排查原因。",
  },
  HCT: {
    normal: "",
    high: "红细胞比容升高意义同RBC升高，常见于脱水、真性红细胞增多症。",
    low: "红细胞比容降低提示贫血，需结合血红蛋白和RBC综合判断。",
    critical: "红细胞比容显著降低提示严重贫血。",
  },
  MCV: {
    normal: "",
    high: "MCV升高（大细胞性）常见于巨幼细胞性贫血（叶酸/B12缺乏）、肝病、酒精中毒等。",
    low: "MCV降低（小细胞性）常见于缺铁性贫血、地中海贫血、慢性病贫血等。",
    critical: "MCV显著异常需进一步行贫血相关检查明确病因。",
  },
  MCH: {
    normal: "",
    high: "MCH升高见于大细胞性贫血（叶酸/B12缺乏）。",
    low: "MCH降低（低色素性）常见于缺铁性贫血、地中海贫血。",
    critical: "MCH显著异常需结合MCV和MCHC综合判断贫血类型。",
  },
  MCHC: {
    normal: "",
    high: "MCHC升高可见于遗传性球形红细胞增多症、自身免疫性溶血性贫血。",
    low: "MCHC降低常见于缺铁性贫血、地中海贫血等低色素性贫血。",
    critical: "MCHC显著异常需警惕溶血或严重铁缺乏。",
  },
  RDWCV: {
    normal: "",
    high: "RDW升高提示红细胞大小不均，常见于缺铁性贫血早期、混合性贫血、溶血等。",
    low: "RDW降低临床意义较小。",
    critical: "RDW显著升高提示严重红细胞生成异常。",
  },
  PLT: {
    normal: "",
    high: "血小板升高可见于感染、炎症、缺铁性贫血恢复期、原发性血小板增多症等。",
    low: "血小板减少可见于免疫性血小板减少症、药物影响、肝硬化脾功能亢进、DIC等。",
    critical: "血小板显著减少有出血风险，需紧急就医；血小板极度升高有血栓风险。",
  },
  MPV: {
    normal: "",
    high: "MPV升高可见于血小板破坏增多（ITP）、骨髓恢复期血小板生成活跃。",
    low: "MPV降低可见于再生障碍性贫血、化疗后骨髓抑制。",
    critical: "MPV显著异常需结合PLT计数综合判断。",
  },
  PCT: {
    normal: "",
    high: "血小板比容升高意义同PLT升高。",
    low: "血小板比容降低意义同PLT降低。",
    critical: "血小板比容显著异常需结合PLT综合判断。",
  },
  PDW: {
    normal: "",
    high: "PDW升高提示血小板大小不均，可见于血小板破坏增多或生成异常。",
    low: "PDW降低临床意义较小。",
    critical: "PDW显著异常需结合PLT和MPV综合判断。",
  },
  PT: {
    normal: "",
    high: "PT延长常见于肝病、维生素K缺乏、口服抗凝药（华法林）使用、DIC等。",
    low: "PT缩短临床意义较小，可见于高凝状态。",
    critical: "PT显著延长有出血风险，需紧急就医评估凝血功能。",
  },
  APTT: {
    normal: "",
    high: "APTT延长常见于血友病、肝素使用、肝病、DIC、狼疮抗凝物等。",
    low: "APTT缩短可见于高凝状态、DIC早期。",
    critical: "APTT显著延长有出血风险，需紧急就医。",
  },
  FIB: {
    normal: "",
    high: "纤维蛋白原升高可见于感染、炎症、创伤、妊娠等（急性时相反应蛋白）。",
    low: "纤维蛋白原降低可见于肝病、DIC、先天性纤维蛋白原缺乏症等。",
    critical: "纤维蛋白原显著降低有严重出血风险，需紧急就医。",
  },
  DD: {
    normal: "",
    high: "D-二聚体升高提示体内有血栓形成和纤溶亢进，常见于深静脉血栓、肺栓塞、DIC、术后等。",
    low: "",
    critical: "D-二聚体显著升高需警惕血栓性疾病，建议尽快就医排查。",
  },
  RET: {
    normal: "",
    high: "网织红细胞升高提示骨髓造血活跃，可见于溶血性贫血、失血后恢复期、治疗后反应。",
    low: "网织红细胞减少提示骨髓造血功能减退，可见于再生障碍性贫血、纯红再障。",
    critical: "网织红细胞显著异常需行骨髓检查明确造血功能状态。",
  },
  ESR: {
    normal: "",
    high: "血沉升高常见于感染、炎症、自身免疫病、肿瘤等（非特异性指标）。",
    low: "血沉降低可见于真性红细胞增多症、镰状细胞病等。",
    critical: "血沉显著升高提示严重炎症或系统性疾病，需结合临床症状综合判断。",
  },
  CRP: {
    normal: "",
    high: "CRP升高提示体内有炎症或感染，显著升高常见于细菌性感染（>50mg/L）。",
    low: "",
    critical: "CRP显著升高提示严重细菌感染或急性炎症状态，建议就医。",
  },
};

export function generateInterpretation(result: IndicatorResult): string {
  const templates = INTERPRETATIONS[result.code];
  if (!templates) {
    return result.level !== "normal" ? `${result.name}${result.level === "high" ? "升高" : "降低"}，请咨询医生了解临床意义。` : "";
  }
  return templates[result.level] ?? "";
}
