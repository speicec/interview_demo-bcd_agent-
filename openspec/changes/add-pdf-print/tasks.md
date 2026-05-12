## 1. Print CSS

- [ ] 1.1 Create `client/src/print.css` — `@media print` 规则：隐藏输入区、对话面板、按钮、空状态；显示结果表格、摘要和页头
- [ ] 1.2 添加打印排版优化：页边距、字号、表格不分页截断（`break-inside: avoid`）

## 2. Print Button Component

- [ ] 2.1 Create `client/src/components/PrintButton.tsx` — 打印按钮组件（图标 + "打印"文字），点击调用 `window.print()`

## 3. Integration

- [ ] 3.1 在 `client/src/App.tsx` header 中引入 PrintButton，仅在有结果时显示
- [ ] 3.2 在 `client/index.html` 中引入 `<link rel="stylesheet" href="/src/print.css" media="print">`
- [ ] 3.3 在 Chrome/Edge 中验证打印 PDF 输出效果
