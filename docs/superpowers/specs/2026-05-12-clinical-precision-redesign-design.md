# Clinical Precision · 临床实验报告风 前端重设计

## 概述

将血常规报告解读助手前端从标准 Tailwind 灰白风格重设计为"临床实验报告"美学：模拟高端医学化验单的印刷品质感——衬线标题、暖白纸色、蓝灰结构线、低饱和绿标识。

## 视觉系统

### 色彩体系

| Token | 色值 | 用途 |
|-------|------|------|
| `background` | `#f9f8f6` | 页面底色（暖白纸色） |
| `card` | `#ffffff` | 卡片底色 |
| `border` | `#e4e8ec` | 卡片/表格边框 |
| `blue-structure` | `#5b7f95` | 图标、表头、结构线 |
| `blue-deep` | `#38586e` | 标题文字、主按钮、数值 |
| `green-safe` | `#4a9d6e` | 正常指标标识 |
| `red-critical` | `#c0392b` | 危急值专用 |
| `amber-warn` | `#b8860b` | 偏高标识（偏暗金） |
| `blue-info` | `#5b7f95` | 偏低标识 |
| `text-primary` | `#2c2c2c` | 正文主色 |
| `text-secondary` | `#7a7a7a` | 辅助信息 |

### 字体系统

- **标题 / 关键标签**：`"Noto Serif SC", "Source Han Serif SC", serif`
- **正文 / UI**：`"PingFang SC", "Microsoft YaHei", sans-serif`
- **等宽数据**：`"JetBrains Mono", "SF Mono", monospace`

### 背景纹理

- 页面点阵网格：`radial-gradient(circle, #d8dce3 1px, transparent 1px)` + `background-size: 20px 20px`
- 无传统 box-shadow，用 1px 边框替代

## 布局结构

- 容器从 `max-w-7xl` 收窄为 `max-w-6xl`
- 主内容区比例从 `grid-cols-5` (3:2) 改为 `grid-cols-7` (5:2)，数据区更宽
- 头部无阴影，仅底部细线分隔
- 底部免责声明区同样细线分隔

## 组件规格

### Card
- 白底 + 1px `border` 边框，无阴影
- 标题区衬线字体 + 下方点线分隔
- 内边距 `p-6`

### Badge
- `rounded-sm` 矩形标签，非药丸形
- 正常：绿边线 + 绿文字
- 偏高：琥珀边线 + 琥珀文字
- 偏低：蓝灰边线 + 蓝灰文字
- 危急：红底 + 红边线 + 白字 + 左侧细线标记

### Button
- primary：深蓝填充 + 白字
- secondary：蓝灰细线描边 + 深蓝文字
- ghost：纯文字，hover 出现浅蓝灰底

### ReportTable
- 表头蓝灰底色 + 衬线小字体
- 等宽数字列
- 极细行分隔线
- 危急行淡红底色
- 排序动画

### ChatPanel
- 用户消息：浅蓝灰底 + 右对齐
- AI 消息：白底 + 左侧蓝灰竖线（批注感）

### AbnormalSummary
- 统计数字大字报，数字 count-up 动画
- 关联预警保持左侧色条样式（`border-l-4`）

### JsonInput
- textarea 细线边框 + 等宽字体
- 校验通过/失败提示：左侧色条 + 淡色底色

## 动效规格

- 页面加载：卡片阶梯淡入（0ms/100ms/200ms stagger）
- 分析结果：异常数字 count-up、表格行依次淡入
- 状态切换：200ms color transition
- 危急项首次展示：红色左边线呼吸动画一次
- 流式文本：逐字追加 + 尾部闪烁光标
- 新消息滑入

## 技术约束

- 引入 shadcn/ui 作为组件基础
- 保持 Tailwind CSS 作为样式框架
- 不改变现有 API 接口和数据结构
- 不改变功能逻辑，仅重设计视觉效果
- 通过 CSS 变量实现主题切换能力
