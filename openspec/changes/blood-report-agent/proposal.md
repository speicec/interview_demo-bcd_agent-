## Why

临床医生和患者需要快速解读血常规报告，但手工逐项比对参考范围低效且容易遗漏多指标关联异常。提供一个粘贴即分析的 Web 工具，结合规则引擎（零延迟、零幻觉）和 DeepSeek 对话能力（追问解释），让血常规解读更高效、更准确。MVP 在单机环境运行，无需外部服务依赖。

## What Changes

- 新增 React 前端：JSON 粘贴输入 + Schema 校验 + 指标结果展示 + AI 对话面板
- 新增规则引擎：基于 2023 中国成人血常规参考标准，逐指标判定等级（正常/偏高/危急/偏低）并生成解读文案
- 新增多指标关联规则：识别细菌性感染模式、贫血类型、骨髓抑制等组合异常
- 新增 Express 后端：规则引擎 API + DeepSeek v4 Flash 对话代理（基于 earendil-works/pi agent 框架）
- 新增批量报告支持：多份报告独立展示 + 标签页切换
- 新增 AI 对话能力：用户可追问指标含义、严重程度、就医建议（流式 SSE 输出）

## Capabilities

### New Capabilities

- `json-schema-validation`: JSON 血常规数据格式校验，基于 ajv + JSON Schema，前端本地执行，毫秒级响应
- `blood-report-analysis`: 规则引擎逐指标比对 2023 指南参考范围，生成等级标签和解读文案，支持性别/年龄校正
- `multi-indicator-correlation`: 多指标关联规则检测，识别组合异常模式（如三系减少、感染模式、贫血分型）
- `ai-medical-chat`: 基于 DeepSeek v4 Flash + pi agent 框架的对话能力，支持追问指标含义、流式 SSE 输出
- `batch-report-management`: 批量粘贴多份报告，独立分析 + 标签页切换展示
- `medical-ui-theme`: 白/蓝/绿医疗主题 UI 组件库（指标表格、异常汇总卡、危急值徽章、免责声明）

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- 新增文件：`client/` (React + Vite + Tailwind), `server/` (Express + pi agent framework)
- 新增依赖：React, Vite, Tailwind CSS, ajv, Express, @earendil-works/pi-ai, @earendil-works/pi-coding-agent, typebox
- 外部服务：DeepSeek API (https://api.deepseek.com, model: deepseek-v4-flash)
- 部署：单机 localhost，无需数据库，无需容器
