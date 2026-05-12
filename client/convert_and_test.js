const fs = require('fs');

// Read the hospital-format sample
const raw = JSON.parse(fs.readFileSync('血常规_sample.json', 'utf8'));

// Map item keys to standard indicator codes
const codeMap = {
  'WBC': 'WBC', 'RBC': 'RBC', 'HGB': 'HGB', 'HCT': 'HCT',
  'MCV': 'MCV', 'MCH': 'MCH', 'MCHC': 'MCHC', 'RDW_CV': 'RDWCV',
  'PLT': 'PLT', 'MPV': 'MPV',
  'NEUT_pct': 'NEUTP', 'LYMPH_pct': 'LYMPHP', 'MONO_pct': 'MONOP',
  'EO_pct': 'EOP', 'BASO_pct': 'BASOP',
  'NEUT_abs': 'NEUT', 'LYMPH_abs': 'LYMPH', 'MONO_abs': 'MONO',
  'EO_abs': 'EO', 'BASO_abs': 'BASO',
  'hsCRP': 'CRP'
};

const indicators = [];
for (const [key, item] of Object.entries(raw.items)) {
  const code = codeMap[key];
  if (code) {
    indicators.push({
      code,
      name: key,
      value: item.value,
      unit: item.unit
    });
  }
}

// Gender mapping
const gender = raw.meta.patient_sex === '男' ? 'male' : 'female';

const report = {
  reportId: raw.meta.sample_id || 'BLD663667',
  patient: {
    gender,
    age: raw.meta.patient_age || 53
  },
  indicators
};

console.log("=== Input Report (converted) ===");
console.log(JSON.stringify(report, null, 2));
console.log("");

// Send to API
const http = require('http');
const data = JSON.stringify(report);

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const result = JSON.parse(body);
    
    console.log("========================================");
    console.log("  血常规报告分析结果");
    console.log("========================================");
    console.log("样本号:", result.reportId);
    console.log("患者:", raw.meta.patient_sex, raw.meta.patient_age + "岁");
    console.log("采样:", raw.meta.sample_time, "  报告:", raw.meta.report_time);
    console.log("");
    console.log("【医院原始标记】", JSON.stringify(raw.meta.abnormal_flags));
    console.log("");
    
    const s = result.summary;
    console.log("【分析汇总】共", s.total, "项 | 正常", s.normal, "| 异常", s.abnormal, "| 危急", s.criticalCount);
    console.log("");
    
    console.log("【逐项判级】");
    console.log("代码      结果       参考范围         单位      判定");
    console.log("─".repeat(65));
    
    const levelOrder = { critical: 0, high: 1, low: 2, normal: 3 };
    const sorted = [...result.indicators].sort((a, b) => (levelOrder[a.level] ?? 3) - (levelOrder[b.level] ?? 3));
    
    for (const ind of sorted) {
      const lbl = { normal: '正常', high: '偏高', low: '偏低', critical: '危急' }[ind.level];
      const bar = { normal: '  ', high: '↑ ', low: '↓ ', critical: '!!' }[ind.level];
      console.log(
        bar,
        ind.code.padEnd(8),
        String(ind.value).padStart(8),
        ' ',
        (ind.refRange.min + '-' + ind.refRange.max).padEnd(14),
        ind.unit.padEnd(8),
        lbl
      );
    }
    
    if (result.alerts.length > 0) {
      console.log("");
      console.log("【关联预警】(" + result.alerts.length + "条)");
      console.log("─".repeat(65));
      for (const a of result.alerts) {
        const sev = { critical: '!! 危急', warn: '!  警告', info: 'i  提示' }[a.severity];
        console.log(sev, a.title);
        console.log("   ", a.description.slice(0, 100));
        console.log("");
      }
    }
    
    console.log("========================================");
    console.log("  分析完成 — 系统运行正常");
    console.log("========================================");
  });
});

req.write(data);
req.end();
