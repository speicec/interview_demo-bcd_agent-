# 结果打印功能设计

## 概述

为血常规报告解读助手添加一键 PDF 导出功能。用户点击「打印报告」按钮后，浏览器打开打印专用窗口并自动弹出打印对话框，用户可选择另存为 PDF 或连接实体打印机。

## 技术方案

**浏览器打印 + 独立 HTML**：点击按钮时构建打印专用 HTML，通过 `window.open()` 写入新窗口，自动调用 `.print()`。与 React 组件零耦合，打印 HTML 由独立工具函数生成。

- 零新增依赖
- 浏览器 PDF 引擎渲染质量高
- 打印样式独立于主 UI

## 架构

```
[打印按钮] → buildPrintHTML(result) → window.open() → document.write(html) → .print()
```

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/lib/printReport.ts` | 新增 | 打印 HTML 构建 + 打印触发 |
| `client/src/App.tsx` | 修改 | Header 添加打印按钮 |

## 打印布局

纸张：A4 纵向，`@page { size: A4; margin: 15mm }`

### 页眉

- 机构名称：「临床检验报告」（可配置常量）
- 字体：衬线加粗，12pt，居中
- 下方分隔线

### 正文（按序排列）

1. **患者信息行**：性别、年龄、报告编号、分析时间
2. **异常概览**：四种计数卡片（危急/偏高/偏低/正常）+ 关联预警列表
3. **指标明细表**：代码、名称、结果值（含单位）、参考范围、判定

### 页脚

- 页码（第 X 页 / 共 Y 页）
- 免责声明短句

## 打印样式要点

- 白底黑字，用细边框和字重区分层级，不依赖颜色（黑白打印机友好）
- 表头每页重复：`thead { display: table-header-group; }`
- 异常概览区 `page-break-inside: avoid`，防止计数卡片被截断
- 关联预警左侧 3px 黑色竖线替代原彩色竖线
- 标题用 serif，正文用 system-ui sans-serif，10-12pt

## 按钮位置

Header 右上角，「清空结果」按钮旁边。仅在有分析结果时显示。

## 数据来源

`AnalysisResult`（来自 `@blood-report/shared`），包含：
- `reportId`、`analyzedAt`、`patient`
- `indicators: IndicatorResult[]`
- `alerts: Alert[]`
- `summary: { total, normal, abnormal, criticalCount }`
