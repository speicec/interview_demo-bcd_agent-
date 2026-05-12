# Clinical Precision 前端重设计 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将血常规报告解读助手前端从标准 Tailwind 灰白风格重设计为"临床实验报告"美学。

**Architecture:** 引入 shadcn/ui 组件体系，通过 CSS 变量注入 Clinical Precision 设计令牌（暖白纸色 + 蓝灰结构 + 低饱和绿标识 + 衬线标题），不改动业务逻辑和 API 接口。

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3, shadcn/ui (class-variance-authority + clsx + tailwind-merge), lucide-react

---

### Task 1: 安装 shadcn/ui 依赖

**Files:**
- Modify: `client/package.json`

- [ ] **Step 1: 安装依赖**

```bash
cd client && npm install class-variance-authority clsx tailwind-merge lucide-react
```

- [ ] **Step 2: 验证安装**

```bash
node -e "require('class-variance-authority'); require('clsx'); require('tailwind-merge'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add client/package.json client/package-lock.json
git commit -m "chore(client): 安装 shadcn/ui 依赖 (cva, clsx, tailwind-merge, lucide-react)"
```

---

### Task 2: 创建 cn 工具函数 + CSS 变量 + Tailwind 主题

**Files:**
- Create: `client/src/lib/utils.ts`
- Modify: `client/src/index.css`
- Modify: `client/tailwind.config.js`

- [ ] **Step 1: 创建 `client/src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: 重写 `client/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 40 14% 97%;        /* #f9f8f6 暖白纸色 */
    --foreground: 0 0% 17%;          /* #2c2c2c */
    --card: 0 0% 100%;               /* #ffffff */
    --card-foreground: 0 0% 17%;
    --border: 210 17% 92%;           /* #e4e8ec */
    --input: 210 17% 92%;
    --ring: 200 23% 48%;             /* #5b7f95 蓝灰 */
    --muted: 40 14% 97%;
    --muted-foreground: 0 0% 48%;    /* #7a7a7a */

    /* 主题色 */
    --primary: 202 34% 33%;          /* #38586e 深蓝 */
    --primary-foreground: 0 0% 100%;
    --secondary: 200 15% 94%;        /* #e9edf0 */
    --secondary-foreground: 202 34% 33%;

    /* 语义色 */
    --safe: 152 36% 46%;             /* #4a9d6e 安全绿 */
    --safe-foreground: 0 0% 100%;
    --warn: 43 63% 38%;              /* #b8860b 暗金 */
    --warn-foreground: 0 0% 100%;
    --danger: 6 66% 48%;             /* #c0392b 危急红 */
    --danger-foreground: 0 0% 100%;
    --info: 200 23% 48%;             /* #5b7f95 蓝灰 */
    --info-foreground: 0 0% 100%;

    /* shadcn 语义映射 */
    --accent: 200 15% 94%;
    --accent-foreground: 202 34% 33%;
    --destructive: 6 66% 48%;
    --destructive-foreground: 0 0% 100%;
    --radius: 0.25rem;
  }

  body {
    @apply bg-[hsl(var(--background))] text-[hsl(var(--foreground))];
    font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  /* 点阵网格背景 */
  .dot-grid {
    background-image: radial-gradient(circle, hsl(210 17% 88% / 0.7) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* 指标标签样式 */
  .indicator-normal {
    @apply text-[hsl(var(--safe))] border border-[hsl(var(--safe)/0.3)] bg-[hsl(var(--safe)/0.06)] rounded-sm;
  }
  .indicator-high {
    @apply text-[hsl(var(--warn))] border border-[hsl(var(--warn)/0.3)] bg-[hsl(var(--warn)/0.06)] rounded-sm;
  }
  .indicator-low {
    @apply text-[hsl(var(--info))] border border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.06)] rounded-sm;
  }
  .indicator-critical {
    @apply text-[hsl(var(--danger))] border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.08)] rounded-sm border-l-4 border-l-[hsl(var(--danger))];
  }

  /* 衬线标题 */
  .serif-title {
    font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
  }

  /* 化验单卡片标题分隔 */
  .card-title-divider {
    @apply border-t border-dotted border-[hsl(var(--border))];
  }
}
```

- [ ] **Step 3: 更新 `client/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        safe: { DEFAULT: "hsl(var(--safe))", foreground: "hsl(var(--safe-foreground))" },
        warn: { DEFAULT: "hsl(var(--warn))", foreground: "hsl(var(--warn-foreground))" },
        danger: { DEFAULT: "hsl(var(--danger))", foreground: "hsl(var(--danger-foreground))" },
        info: { DEFAULT: "hsl(var(--info))", foreground: "hsl(var(--info-foreground))" },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"SimSun"', "serif"],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "blink-cursor": "blink 1s step-end infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "breathe": "breathe 2s ease-in-out 1",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        fadeIn: { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        breathe: { "0%, 100%": { boxShadow: "inset 4px 0 0 hsl(var(--danger))" }, "50%": { boxShadow: "inset 4px 0 0 hsl(var(--danger) / 0.3)" } },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Commit**

```bash
mkdir -p client/src/lib
git add client/src/lib/utils.ts client/src/index.css client/tailwind.config.js
git commit -m "feat(client): 配置 Clinical Precision 设计令牌与 shadcn/ui CSS 变量"
```

---

### Task 3: 添加字体加载 + 更新 HTML

**Files:**
- Modify: `client/index.html`

- [ ] **Step 1: 更新 `client/index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>血常规报告解读助手</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Serif+SC:wght@600;700;900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dot-grid">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add client/index.html
git commit -m "feat(client): 添加 Noto Serif SC + JetBrains Mono 字体加载"
```

---

### Task 4: 创建 shadcn/ui Button 组件

**Files:**
- Modify: `client/src/components/ui/Button.tsx`

- [ ] **Step: 重写 Button**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border text-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ui/Button.tsx
git commit -m "feat(client): 重写 Button 为 shadcn/ui cva 变体组件"
```

---

### Task 5: 创建 shadcn/ui Card 组件

**Files:**
- Modify: `client/src/components/ui/Card.tsx`

- [ ] **Step: 重写 Card**

```tsx
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border rounded-sm", className)}>
      {title && (
        <div className="px-6 pt-5 pb-3">
          <h3 className="serif-title text-base font-bold text-foreground tracking-wide">
            {title}
          </h3>
          <hr className="card-title-divider mt-2" />
        </div>
      )}
      <div className={title ? "px-6 pb-5" : "p-6"}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ui/Card.tsx
git commit -m "feat(client): 重写 Card 为衬线标题 + 点线分隔样式"
```

---

### Task 6: 创建 shadcn/ui Badge 组件

**Files:**
- Modify: `client/src/components/ui/Badge.tsx`

- [ ] **Step: 重写 Badge**

```tsx
import { cn } from "../../lib/utils";
import type { SeverityLevel } from "@blood-report/shared";

const severityClass: Record<SeverityLevel, string> = {
  normal: "indicator-normal",
  high: "indicator-high",
  low: "indicator-low",
  critical: "indicator-critical",
};

const severityLabel: Record<SeverityLevel, string> = {
  normal: "正常",
  high: "偏高",
  low: "偏低",
  critical: "危急",
};

export function Badge({ level, className = "" }: { level: SeverityLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium",
        severityClass[level],
        className
      )}
    >
      {severityLabel[level]}
    </span>
  );
}

export function CountBadge({ count, level }: { count: number; level: SeverityLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold",
        severityClass[level]
      )}
    >
      {count}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ui/Badge.tsx
git commit -m "feat(client): 重写 Badge 为 rounded-sm + 左边线危急样式"
```

---

### Task 7: 创建 Input + Textarea 组件

**Files:**
- Create: `client/src/components/ui/Input.tsx`
- Create: `client/src/components/ui/Textarea.tsx`

- [ ] **Step 1: 创建 `client/src/components/ui/Input.tsx`**

```tsx
import { cn } from "../../lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm",
        "font-sans placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: 创建 `client/src/components/ui/Textarea.tsx`**

```tsx
import { cn } from "../../lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-sm border border-border bg-card px-4 py-3 font-mono text-sm leading-relaxed",
        "placeholder:text-muted-foreground resize-y",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ui/Input.tsx client/src/components/ui/Textarea.tsx
git commit -m "feat(client): 创建 shadcn/ui Input + Textarea 组件"
```

---

### Task 8: 更新 App.tsx 布局 + 页面加载动画

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step: 重写 App.tsx 布局部分**

将 `App.tsx` 中的 JSX 部分做以下修改（只改动 className 和结构，不改业务逻辑）：

- 根容器 `bg-gray-50` → `dot-grid min-h-screen`
- Header `bg-white border-b border-gray-200 sticky top-0 z-10` → `bg-card border-b border-border sticky top-0 z-10`
- Header 高度 `h-14` → `h-16`（稍高更舒展）
- 图标容器 `w-8 h-8 rounded-lg bg-primary-600` → `w-9 h-9 rounded-sm bg-primary flex items-center justify-center`
- 标题 `<h1>` 添加 `serif-title` 类
- 主容器 `max-w-7xl` → `max-w-6xl`
- 分栏 `lg:grid-cols-5` → `lg:grid-cols-7`
- 左侧 `lg:col-span-3` → `lg:col-span-5`
- 右侧 `lg:col-span-2` → `lg:col-span-2`
- Footer `bg-white border-t border-gray-200` → `bg-card border-t border-border`
- 空状态图标颜色从 `text-gray-200` 改为 `text-border`
- 每个 Card 添加 `animate-fade-in` + `animation-delay` 阶梯：
  - 第1个 Card: `style={{ animationDelay: "0ms" }}`
  - 第2个 Card: `style={{ animationDelay: "100ms" }}`
  - 第3个 Card: `style={{ animationDelay: "200ms" }}`
  - 以此类推

Loading spinner 颜色从 `border-primary-500` 改为 `border-primary`。

- [ ] **Step 2: 验证运行**

```bash
cd client && npx vite build --logLevel error
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat(client): 更新 App 布局 — 6xl 容器 + 5:2 分栏 + 淡入动画"
```

---

### Task 9: 更新 JsonInput 组件

**Files:**
- Modify: `client/src/components/JsonInput.tsx`

- [ ] **Step: 重写 JsonInput**

将 `JsonInput.tsx` 中的样式部分替换：

- `<textarea>` 替换为 `<Textarea>` 组件，高度 `h-48`
- 校验错误区 `border-danger-500/30 bg-danger-50` → `border border-danger/30 bg-danger/[0.06] rounded-sm`
- 校验通过区 `border-safe-500/30 bg-safe-50` → `border border-safe/30 bg-safe/[0.06] rounded-sm`
- 标题从 `text-gray-600 uppercase tracking-wide` 改为 `serif-title text-base font-bold`
- 移除旧 Button import，改用新的 `import { Button } from "./ui/Button"`
- 添加 `import { Textarea } from "./ui/Textarea"`

- [ ] **Step 2: 验证编译**

```bash
cd client && npx tsc --noEmit 2>&1 | head -20
```

Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/JsonInput.tsx
git commit -m "feat(client): 重设计 JsonInput — Textarea 组件 + 衬线标题"
```

---

### Task 10: 更新 ReportTable 组件

**Files:**
- Modify: `client/src/components/ReportTable.tsx`

- [ ] **Step: 重写 ReportTable**

替换 `ReportTable.tsx` 的样式：

- `<table>` 外层容器不变
- thead `<tr>` 从 `border-b border-gray-200` 改为 `border-b border-border bg-secondary/50`
- `<th>` 从 `text-gray-500` 改为 `text-muted-foreground font-serif tracking-wide`
- `<td>` 代码列 `font-mono text-xs text-gray-400` → `font-mono text-xs text-muted-foreground`
- 危急行 `<tr>` 添加条件类：`ind.level === "critical" ? "bg-danger/[0.04]" : ""`
- hover 行 `hover:bg-gray-50/50` → `hover:bg-secondary/50 transition-colors`
- 危急值文字 `text-danger-600` → `text-danger`

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ReportTable.tsx
git commit -m "feat(client): 重设计 ReportTable — 衬线表头 + 危急行高亮"
```

---

### Task 11: 更新 AbnormalSummary 组件

**Files:**
- Modify: `client/src/components/AbnormalSummary.tsx`

- [ ] **Step: 重写 AbnormalSummary**

样式变更：

- SummaryStat 计数卡：`rounded-lg` → `rounded-sm`，`bg-*-50` → `bg-*/[0.06]`，边框 `border border-*/30`
- 关联预警卡片：`border-l-4 p-3 rounded-r-lg` → `border-l-4 p-3 rounded-sm`，移除 `rounded-r-lg`
- AbnormalSection 标题 `text-gray-500 uppercase` → `serif-title text-sm text-muted-foreground`
- 异常指标行 `bg-gray-50 rounded-lg` → `bg-secondary/30 rounded-sm`
- 全部正常图标 `text-safe-500` → `text-safe`

- [ ] **Step 2: Commit**

```bash
git add client/src/components/AbnormalSummary.tsx
git commit -m "feat(client): 重设计 AbnormalSummary — 细线计数卡 + 衬叶子标题"
```

---

### Task 12: 更新 ChatPanel 组件

**Files:**
- Modify: `client/src/components/ChatPanel.tsx`

- [ ] **Step: 重写 ChatPanel**

样式变更：

- 标题 `text-gray-600 uppercase` → `serif-title text-base font-bold`
- 空状态图标 `text-gray-300` → `text-border`
- 用户消息气泡 `bg-primary-600` → `bg-primary`
- AI 消息气泡 `bg-gray-100` → `bg-secondary border-l-4 border-l-primary/30 rounded-sm`
- 输入框替换为 `<Input>` 组件
- 发送按钮改用新的 `<Button>`
- 清空对话按钮 `text-gray-400` → `text-muted-foreground`
- 错误提示 `text-danger-500` → `text-danger`

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ChatPanel.tsx
git commit -m "feat(client): 重设计 ChatPanel — AI 批注样式 + Input 组件"
```

---

### Task 13: 更新 BatchTabs + BatchOverview 组件

**Files:**
- Modify: `client/src/components/BatchTabs.tsx`
- Modify: `client/src/components/BatchOverview.tsx`

- [ ] **Step 1: 重写 BatchTabs**

样式变更：

- 容器 `border-b border-gray-200` → `border-b border-border`
- 激活 tab `border-primary-600 text-primary-600` → `border-primary text-primary`
- 未激活 tab `text-gray-500` → `text-muted-foreground`
- hover `hover:border-gray-300` → `hover:border-border`

- [ ] **Step 2: 重写 BatchOverview**

样式变更：

- thead `<tr>` `border-b border-gray-200` → `border-b border-border bg-secondary/50`
- `<th>` `text-gray-500 uppercase` → `text-muted-foreground font-serif tracking-wide`
- 正常计数值 `text-safe-600` → `text-safe`
- 异常计数值 `text-warn-600` → `text-warn`
- 危急 badge `bg-danger-100 text-danger-600` → `bg-danger/[0.08] text-danger`
- 无预警 `text-gray-300` → `text-muted-foreground/50`

- [ ] **Step 3: Commit**

```bash
git add client/src/components/BatchTabs.tsx client/src/components/BatchOverview.tsx
git commit -m "feat(client): 重设计 BatchTabs + BatchOverview 配色"
```

---

### Task 14: 更新 Disclaimer 组件

**Files:**
- Modify: `client/src/components/ui/Disclaimer.tsx`

- [ ] **Step: 重写 Disclaimer**

```tsx
export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-secondary/30 border border-border rounded-sm text-xs text-muted-foreground">
      <svg className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
      <span>本工具仅供健康参考，不构成医疗诊断。如有异常指标请咨询专业医生。</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ui/Disclaimer.tsx
git commit -m "feat(client): 重设计 Disclaimer — 暖色系免责声明"
```

---

### Task 15: 最终验证与修复

**Files:**
- 验证所有文件

- [ ] **Step 1: TypeScript 编译检查**

```bash
cd client && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Vite 构建检查**

```bash
cd client && npx vite build
```

Expected: Build succeeds.

- [ ] **Step 3: 检查未使用的 import**

```bash
cd client && npx tsc --noEmit --noUnusedLocals 2>&1 | head -20 || true
```

修复所有未使用变量警告。

- [ ] **Step 4: 最终提交**

```bash
git add -A
git commit -m "feat(client): Clinical Precision 前端重设计完成

- shadcn/ui 组件体系（Button, Card, Badge, Input, Textarea）
- 暖白纸色 + 蓝灰结构 + 低饱和绿标识
- Noto Serif SC 衬线标题 + JetBrains Mono 等宽数据
- 点阵网格背景 + 细线边框无阴影
- 5:2 非对称分栏布局
- 阶梯淡入加载动画"
```
