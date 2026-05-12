## Context

当前前端 `client/` 基于 React 18 + Vite + Tailwind CSS，分析结果以 HTML 形式渲染。用户需要将结果导出为 PDF 用于存档或分享。

## Goals / Non-Goals

**Goals:**
- 用户点击按钮后触发浏览器打印对话框，可选择"另存为 PDF"
- 打印输出仅包含分析结果，隐藏输入区、对话面板、按钮等交互元素
- 打印排版整洁，表格不分页截断，有基本的页头信息

**Non-Goals:**
- 不引入第三方 PDF 库（如 jsPDF、html2canvas、react-to-print）
- 不支持服务端 PDF 生成
- 不自定义打印对话框或绕过浏览器原生行为

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 打印方案 | `window.print()` + `@media print` CSS | 零依赖，所有浏览器内置"另存为 PDF"，最快实现 |
| 打印按钮位置 | App Header 右侧，有结果时显示 | 与现有"清空结果"按钮并列，语义清晰 |
| CSS 策略 | 独立 `print.css` 文件，`<link media="print">` 引入 | 与 Tailwind 样式隔离，浏览器仅在打印时加载 |
| 隐藏策略 | 使用 `display: none !important` 显式隐藏 | 覆盖面广，不依赖 Tailwind 的 `@media print` 行为 |

## Risks / Trade-offs

- **浏览器 PDF 输出差异** → 采用保守 CSS（避免 grid/flex 中复杂布局依赖），在 Chrome/Edge/Firefox 上验证
- **长表格分页截断** → 使用 `break-inside: avoid` 保护表格行
- **中文字体嵌入** → 浏览器自动处理，无需特殊配置
