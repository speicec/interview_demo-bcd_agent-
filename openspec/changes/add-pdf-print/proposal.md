## Why

用户需要将分析结果导出为 PDF 用于存档、打印或发送给他人。当前前端展示只能在浏览器中查看，无法离线保存或分享。采用浏览器原生打印方案（`window.print()` + `@media print` CSS），零依赖、零配置，所有主流浏览器均支持"另存为 PDF"。

## What Changes

- 在结果页面添加"打印"按钮，触发浏览器打印对话框
- 添加 `@media print` CSS 规则，隐藏输入区、对话面板、按钮等非打印元素
- 优化打印排版：字号、间距、分页避免截断表格
- 在打印页头显示报告标题与生成时间

## Capabilities

### New Capabilities

- `pdf-print`: 通过浏览器原生打印功能将分析结果导出为 PDF 或打印到纸张

### Modified Capabilities

<!-- 不修改现有 spec -->

## Impact

- 仅影响 `client/` 前端模块
- 新增文件：`client/src/components/PrintButton.tsx`、`client/src/print.css`
- 修改文件：`client/src/App.tsx`（引入打印按钮）、`client/index.html`（引入 print.css）
- 零外部依赖
