import type { AnalysisResult } from "@blood-report/shared";

const HEADER_TITLE = "临床检验报告";
const DISCLAIMER = "本报告由自动化系统生成，仅供参考，不构成医疗诊断。";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function genderLabel(g?: string): string {
  if (g === "male") return "男";
  if (g === "female") return "女";
  return g ?? "—";
}

function levelLabel(level: string): string {
  const map: Record<string, string> = {
    critical: "危急",
    high: "偏高",
    low: "偏低",
    normal: "正常",
  };
  return map[level] ?? level;
}

export function buildPrintHTML(result: AnalysisResult): string {
  const indicators = [...result.indicators].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, low: 2, normal: 3 };
    return (order[a.level] ?? 3) - (order[b.level] ?? 3);
  });

  const indicatorRows = indicators
    .map(
      (ind) => `
        <tr class="${ind.level !== "normal" ? "abnormal" : ""}">
          <td><span class="code">${ind.code}</span> ${ind.name}</td>
          <td class="num">${ind.value} <span class="unit">${ind.unit}</span></td>
          <td class="num">${ind.refRange.min} – ${ind.refRange.max}</td>
          <td class="center">${levelLabel(ind.level)}</td>
        </tr>`
    )
    .join("");

  const alertItems = result.alerts
    .map(
      (a) => `
        <div class="alert">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.description}</div>
        </div>`
    )
    .join("");

  const critical = result.indicators.filter((i) => i.level === "critical").length;
  const high = result.indicators.filter((i) => i.level === "high").length;
  const low = result.indicators.filter((i) => i.level === "low").length;
  const normal = result.indicators.filter((i) => i.level === "normal").length;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${HEADER_TITLE} — ${result.reportId}</title>
<style>
  @page { size: A4; margin: 15mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Serif SC", serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.6;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .header h1 {
    font-family: "Noto Serif SC", "SimSun", serif;
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: 2px;
  }
  .header .subtitle {
    font-size: 9pt;
    color: #555;
    margin-top: 4px;
  }
  .meta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    font-size: 10pt;
    margin-bottom: 20px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    background: #fafafa;
  }
  .meta span { white-space: nowrap; }
  .meta strong { font-weight: 600; }

  .section-title {
    font-family: "Noto Serif SC", "SimSun", serif;
    font-size: 13pt;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
    padding-bottom: 4px;
    margin: 24px 0 10px;
    page-break-after: avoid;
  }

  .summary-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    page-break-inside: avoid;
  }
  .summary-card {
    flex: 1;
    min-width: 60px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ccc;
  }
  .summary-card .count { font-size: 20pt; font-weight: 700; }
  .summary-card .label { font-size: 9pt; color: #555; }

  .alerts { margin-bottom: 16px; page-break-inside: avoid; }
  .alert {
    border-left: 3px solid #1a1a1a;
    padding: 6px 10px;
    margin-bottom: 6px;
    background: #f5f5f5;
  }
  .alert-title { font-weight: 700; font-size: 10pt; }
  .alert-desc { font-size: 9pt; color: #555; margin-top: 2px; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
  }
  thead { display: table-header-group; }
  thead th {
    text-align: left;
    padding: 6px 8px;
    border-bottom: 2px solid #1a1a1a;
    font-weight: 700;
    font-size: 9pt;
    color: #555;
    background: #fafafa;
  }
  tbody td {
    padding: 5px 8px;
    border-bottom: 1px solid #e0e0e0;
  }
  tbody tr.abnormal td { font-weight: 600; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .center { text-align: center; }
  .code { font-family: "JetBrains Mono", "SF Mono", monospace; font-size: 9pt; color: #555; }
  .unit { font-size: 9pt; color: #777; }

  .footer {
    margin-top: 24px;
    padding-top: 8px;
    border-top: 1px solid #ccc;
    font-size: 8pt;
    color: #888;
    text-align: center;
  }
  .footer .pages { margin-bottom: 2px; }
</style>
</head>
<body>
  <div class="header">
    <h1>${HEADER_TITLE}</h1>
    <div class="subtitle">生成时间：${formatDate(result.analyzedAt)}</div>
  </div>

  <div class="meta">
    <span><strong>报告编号：</strong>${result.reportId}</span>
    ${result.patient ? `
    <span><strong>性别：</strong>${genderLabel(result.patient.gender)}</span>
    <span><strong>年龄：</strong>${result.patient.age ?? "—"} 岁</span>
    ` : ""}
    <span><strong>分析时间：</strong>${formatDate(result.analyzedAt)}</span>
  </div>

  <div class="section-title">异常概览</div>

  <div class="summary-grid">
    <div class="summary-card"><div class="count">${critical}</div><div class="label">危急</div></div>
    <div class="summary-card"><div class="count">${high}</div><div class="label">偏高</div></div>
    <div class="summary-card"><div class="count">${low}</div><div class="label">偏低</div></div>
    <div class="summary-card"><div class="count">${normal}</div><div class="label">正常</div></div>
  </div>

  ${alertItems ? `<div class="alerts">${alertItems}</div>` : ""}

  <div class="section-title">指标明细</div>

  <table>
    <thead>
      <tr>
        <th>指标</th>
        <th class="num">结果</th>
        <th class="num">参考范围</th>
        <th class="center">判定</th>
      </tr>
    </thead>
    <tbody>${indicatorRows}</tbody>
  </table>

  <div class="footer">
    <div>${DISCLAIMER}</div>
  </div>
</body>
</html>`;
}

export function printReport(result: AnalysisResult): void {
  const html = buildPrintHTML(result);
  const w = window.open("", "_blank", "width=800,height=600");
  if (!w) {
    alert("请允许弹出窗口以打印报告");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}
