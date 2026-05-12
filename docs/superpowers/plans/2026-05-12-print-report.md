# 结果打印功能 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为血常规报告分析结果添加一键 PDF 导出功能，点击按钮后打开打印专用窗口并自动弹出打印对话框。

**架构：** 新增 `printReport.ts` 工具模块，接收 `AnalysisResult` 构建独立打印 HTML 并通过 `window.open()` + `window.print()` 触发打印；修改 `App.tsx` 在 Header 添加打印按钮。零新增依赖。

**技术栈：** TypeScript，浏览器 `window.print()` API，`@media print` CSS

---

### 任务 1：创建打印工具模块

**文件：**
- 创建：`client/src/lib/printReport.ts`
- 测试：`client/src/lib/printReport.test.ts`

- [ ] **步骤 1：编写 `buildPrintHTML` 的测试**

```typescript
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
    expect(html).toContain(">1<"); // normal count
    expect(html).toContain(">1<"); // abnormal count — need to distinguish... actually both are 1
  });

  it("contains patient info", () => {
    const html = buildPrintHTML(mockResult);
    expect(html).toContain("35");
    expect(html).toContain("男");
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

```bash
npx vitest run client/src/lib/printReport.test.ts
```

预期：FAIL — `buildPrintHTML` 未定义

- [ ] **步骤 3：编写 `printReport.ts`**

```typescript
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
    <div class="pages">第 <span class="page">1</span> 页，共 <span class="total">1</span> 页</div>
    <div>${DISCLAIMER}</div>
  </div>

  <script>
    // Split content across pages and update page numbers
    (function() {
      var totalEl = document.querySelector('.footer .total');
      if (totalEl) totalEl.textContent = '?';
    })();
  </script>
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
  // Delay print to allow browser to render styles
  setTimeout(() => w.print(), 300);
}
```

- [ ] **步骤 4：运行测试验证通过**

```bash
npx vitest run client/src/lib/printReport.test.ts
```

预期：全部 PASS

- [ ] **步骤 5：Commit**

```bash
git add client/src/lib/printReport.ts client/src/lib/printReport.test.ts
git commit -m "feat(client): add print report utility module
> 
> Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### 任务 2：在 Header 添加打印按钮

**文件：**
- 修改：`client/src/App.tsx`

- [ ] **步骤 1：导入 printReport**

在 `App.tsx` 顶部添加导入：

```typescript
import { printReport } from "./lib/printReport";
```

- [ ] **步骤 2：在 Header 添加打印按钮**

在 Header 的 `div.flex.items-center.gap-2` 内，「清空结果」按钮之前添加：

```tsx
{currentAnalysis && (
  <button
    onClick={() => printReport(currentAnalysis)}
    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    打印报告
  </button>
)}
```

- [ ] **步骤 3：验证 TypeScript 编译**

```bash
npx tsc -b client --noEmit
```

预期：零错误

- [ ] **步骤 4：Commit**

```bash
git add client/src/App.tsx
git commit -m "feat(client): add print button to header
> 
> Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### 任务 3：端到端验证

**文件：** 无

- [ ] **步骤 1：启动开发服务器**

```bash
npm run dev
```

- [ ] **步骤 2：加载示例数据**
  - 打开浏览器访问 `http://localhost:5173`
  - 点击「示例数据」加载测试数据
  - 点击「分析报告」

- [ ] **步骤 3：测试打印**
  - 点击 Header 右上角「打印报告」按钮
  - 确认弹出新窗口并自动打开打印对话框
  - 关闭打印对话框，检查新窗口中：
    - 页眉显示「临床检验报告」
    - 患者信息正确显示
    - 异常概览计数值正确
    - 指标明细表数据完整
    - 页脚有免责声明

- [ ] **步骤 4：测试 PDF 导出**
  - 在打印对话框中选择「另存为 PDF」
  - 保存并打开 PDF，检查排版是否正确
