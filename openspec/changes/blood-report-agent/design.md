## Context

单机环境运行的 Web 应用，用户在前端粘贴 JSON 格式血常规数据，系统自动校验、分析、展示结果，并支持通过 DeepSeek 对话追问。无数据库依赖，无需容器化，面向临床医生和患者两类用户。

## Goals / Non-Goals

**Goals:**
- 粘贴 JSON → Schema 校验 → 即时分析 → 可视化结果，完整链路 < 2 秒（不含 LLM）
- 规则引擎覆盖 20+ 血常规核心指标，基于 2023 中国成人参考标准
- 多指标关联规则识别组合异常模式
- DeepSeek v4 Flash 流式对话，支持追问和解释
- 批量报告独立分析 + 标签页切换
- 白/蓝/绿医疗主题，响应式布局

**Non-Goals:**
- 不提供诊断结论，仅提供健康提醒和就医建议（均有免责声明）
- 不支持用户登录/注册/权限管理
- 不支持报告持久化存储（刷新即丢失，MVP 阶段）
- 不支持 HIS/LIS 系统对接
- 不支持移动端原生 App

## Decisions

### 1. 架构分层

```
┌─────────────────────────────────────────────────┐
│  Presentation Layer (React)                      │
│  JsonInput / ReportTable / ChatPanel / BatchTabs│
├─────────────────────────────────────────────────┤
│  API Layer (Express Routes)                     │
│  /api/analyze  /api/chat/stream  /api/batch     │
├─────────────────────────────────────────────────┤
│  Agent Layer (pi-agent-core)                    │
│  SessionManager / Custom Tools / SystemPrompt   │
├─────────────────────────────────────────────────┤
│  Engine Layer (Pure TypeScript)                  │
│  RuleEngine / ReferenceRanges / CorrelationRules│
└─────────────────────────────────────────────────┘
```

**Why**: 四层分离确保每层独立可测、可替换。Engine 层零外部依赖，可单独发布为 npm 包。Agent 层通过 pi SDK 统一管理 LLM 调用、工具注册、会话状态。

### 2. 规则引擎 vs LLM 分工

| 职责 | 规则引擎 | LLM (DeepSeek) |
|------|---------|----------------|
| 数值比对参考范围 | ✅ 唯一来源 | ❌ |
| 等级判定 (正常/偏高/危急/偏低) | ✅ 唯一来源 | ❌ |
| 多指标关联判断 | ✅ 唯一来源 | ❌ |
| 解读文案生成 | ✅ 模板化文案 | 辅助润色 |
| 对话追问 | ❌ | ✅ 唯一来源 |
| 非结构化问题 | ❌ | ✅ |

**Why**: 医疗场景对准确性要求极高。数值比对和等级判定由确定性的规则引擎处理，零幻觉风险。LLM 仅负责对话和追问，其输出受 System Prompt 约束（必须以规则引擎结果为权威来源）。

**Alternatives considered**: 
- 纯 LLM 方案：数值判断可能有幻觉，且每次调用有延迟和成本
- 纯规则引擎方案：无法处理追问和灵活对话

### 3. Pi Agent 框架集成方式

使用 `@earendil-works/pi-coding-agent` SDK 嵌入式模式（非 CLI 模式）：

- `createAgentSession()` 创建会话，`SessionManager.inMemory()` 无持久化
- DeepSeek 通过 pi-ai 的 OpenAI 兼容 provider 注册（baseURL: `https://api.deepseek.com`）
- 自定义工具 `analyze_blood_report` 和 `get_reference_range` 通过 `defineTool()` 注册
- System Prompt 通过 `DefaultResourceLoader` 的 `systemPromptOverride` 注入
- 流式输出通过 `session.subscribe()` 监听事件 → SSE → 前端

**Why**: SDK 模式支持同一进程内直接调用规则引擎（TypeScript），避免 RPC 序列化开销。`session.subscribe()` 提供完整事件流（text_delta、tool_execution_start/end、turn_end），SSE 转发自然。

### 4. DeepSeek 配置

```typescript
// provider registration
pi.registerProvider("deepseek", {
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
  models: {
    "deepseek-v4-flash": { contextWindow: 128000, maxOutput: 8192 },
  },
});
```

使用 `deepseek-v4-flash`：推理速度快，中文能力强，成本远低于 v4-pro。

### 5. 前端 JSON Schema 校验

使用 ajv（最快 JSON Schema 校验器），在前端本地执行，零网络延迟。

Schema 核心结构：
```json
{
  "type": "object",
  "required": ["indicators"],
  "properties": {
    "reportId": { "type": "string" },
    "patient": {
      "type": "object",
      "properties": {
        "gender": { "enum": ["male", "female"] },
        "age": { "type": "number", "minimum": 0, "maximum": 150 }
      }
    },
    "indicators": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["code", "value", "unit"],
        "properties": {
          "code": { "type": "string", "pattern": "^[A-Z][A-Z0-9]{1,5}$" },
          "value": { "type": "number" },
          "unit": { "type": "string" }
        }
      }
    }
  }
}
```

`refRange` 字段可选——若不提供，使用内置 2023 指南默认值。

### 6. 对话上下文管理

每次 `/api/chat/stream` 请求：
1. 前端发送 `{ chatId, message, reportContext }` 
2. 后端从 SessionPool 获取或创建 pi session
3. 将当前报告的规则引擎分析结果拼入 context
4. 保留最近 10 轮对话历史（pi session 自动管理消息历史）
5. SSE 流式返回 text_delta 事件

SessionPool: `Map<string, AgentSession>`，30 分钟 TTL，定时清理过期会话。

### 7. 模块拆分与并行开发策略

```
Phase 0 (串行，30min)：
  └─ shared-types：TypeScript 类型 + JSON Schema + 参考范围数据结构

Phase 1 (并行，3 个 worktree)：
  ├─ rule-engine：规则引擎 + 解读规则 + 关联规则（依赖 shared-types）
  ├─ server-scaffold：Express 骨架 + pi 配置 + API 路由模板（依赖 shared-types）
  └─ react-frontend：React + Vite + Tailwind + UI 组件（依赖 shared-types，mock 数据开发）

Phase 2 (串行，30min)：
  └─ integration：API 路由对接规则引擎 + pi 对话 + 前端对接后端
```

| Worktree | 产出 | 可并行 |
|----------|------|--------|
| `bt-shared-types` | types.ts, schema.ts, referenceRanges.ts | 先完成 |
| `bt-rule-engine` | ruleEngine.ts, interpretationRules.ts, correlationRules.ts | ✅ |
| `bt-server` | Express + pi agent + API routes | ✅ |
| `bt-frontend` | React app + UI components | ✅ |

## Risks / Trade-offs

- **[Risk] DeepSeek API 不可用** → 规则引擎独立工作，对话面板降级为静态 FAQ
- **[Risk] 参考范围一刀切** → 支持 JSON 中自定义 refRange 字段覆盖默认值；后续版本可按医院定制
- **[Risk] SessionPool 内存泄漏** → 30 分钟 TTL + 定时清理 + 最大 pool size 限制 (100)
- **[Trade-off] 不持久化** → MVP 刷新即丢失，但大幅降低复杂度（无数据库、无文件 I/O）
- **[Trade-off] pi 框架学习成本** → SDK 模式 API 清晰，嵌入式集成代码量小（~100 行）；若 pi 版本 Breaking Change 需跟进
