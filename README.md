# 血常规报告解读助手 (Blood Report Agent)

基于规则引擎 + DeepSeek AI 的血常规报告解读工具。粘贴 JSON 格式血常规数据，即时获得符合 2023 中国成人标准参考范围的分析结果和关联预警。

## 功能概述

- **即时分析** — 粘贴 JSON 报告，自动校验格式，对 25+ 项血常规指标进行比对分析
- **规则引擎** — 基于 2023 中国成人血常规参考标准的确定性规则引擎，零幻觉
- **关联预警** — 识别 9 种组合异常模式（细菌性感染、各类贫血、三系减少、炎症三联征等）
- **AI 对话** — 通过 DeepSeek v4 Flash 追问指标含义、严重程度、就医建议（支持 SSE 流式输出）
- **批量报告** — 一次粘贴多份报告，标签页独立展示分析结果
- **前端校验** — ajv JSON Schema 本地校验，毫秒级响应

## 项目结构

```
├── shared/          # 共享类型、JSON Schema、参考范围数据、常量
├── engine/          # 规则引擎（零外部依赖，可独立发布）
│   ├── referenceLookup.ts      # 参考范围查找（性别/年龄校正）
│   ├── indicatorAnalyzer.ts    # 单指标判级（正常/偏高/偏低/危急）
│   ├── interpretationRules.ts  # 解读文案模板（25+ 指标 × 4 等级）
│   ├── correlationRules.ts     # 9 种多指标关联规则
│   └── ruleEngine.ts          # 主编排器
├── server/          # Express API 服务
│   ├── routes/analyze.ts       # POST /api/analyze
│   ├── routes/chat.ts          # POST /api/chat/stream（SSE）、/api/chat
│   ├── routes/batch.ts         # POST /api/batch/analyze
│   ├── sessionPool.ts          # 对话会话池（30min TTL，最大 100 会话）
│   └── config.ts               # DeepSeek 配置
└── client/          # React 前端（Vite + Tailwind CSS）
    └── src/
        ├── components/         # UI 组件
        │   ├── ui/             # Badge、Card、Button、Disclaimer
        │   ├── JsonInput.tsx   # JSON 输入 + ajv 校验
        │   ├── ReportTable.tsx # 可排序指标明细表
        │   ├── AbnormalSummary.tsx # 异常概览 + 关联预警
        │   ├── ChatPanel.tsx   # AI 对话面板（SSE 流式渲染）
        │   ├── BatchTabs.tsx   # 批量报告标签页
        │   └── BatchOverview.tsx # 批量概览表
        ├── hooks/              # useAnalysis、useChatStream
        └── data/               # 示例数据
```

## 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | >= 20.0 |
| npm | >= 10.0 |

**外部服务（可选）**：DeepSeek API Key — 仅 AI 对话功能需要，规则引擎无需任何外部服务即可独立运行。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 DeepSeek API Key（可选）

AI 对话功能需要 DeepSeek API Key。不配置时分析功能正常工作，对话面板会显示"服务暂未配置"。

**Windows PowerShell：**
```powershell
$env:DEEPSEEK_API_KEY = "sk-xxxxxxxxxxxxxxxx"
```

**Windows CMD：**
```cmd
set DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

**Linux / macOS / Git Bash：**
```bash
export DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"
```

获取 API Key：[platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)

### 3. 启动服务

**同时启动前后端（推荐）：**
```bash
npm run dev
```

**或分别启动：**
```bash
# 终端 1 — 后端（端口 3001）
npm run dev -w server

# 终端 2 — 前端（端口 5173）
npm run dev -w client 
```

### 4. 访问应用

浏览器打开 **http://localhost:5173**

## 使用方法

### 单份报告分析

1. 将血常规数据整理为 JSON 格式（参见下方格式说明）
2. 粘贴到左侧输入框，或点击「示例数据」加载演示数据
3. 系统自动校验 JSON 格式，校验通过后点击「分析报告」
4. 查看异常概览、关联预警和指标明细表
5. 在右侧对话面板追问具体问题

### 批量报告分析

直接粘贴 **JSON 数组**格式的多份报告，系统自动识别并切换为批量模式，每份报告独立分析、独立展示。

### JSON 数据格式

```json
{
  "reportId": "MY-20250101-001",
  "patient": {
    "gender": "male",
    "age": 35
  },
  "indicators": [
    { "code": "WBC",  "value": 12.5, "unit": "×10⁹/L" },
    { "code": "NEUT", "value": 9.2,  "unit": "×10⁹/L" },
    { "code": "LYMPH","value": 1.8,  "unit": "×10⁹/L" },
    { "code": "RBC",  "value": 5.1,  "unit": "×10¹²/L" },
    { "code": "HGB",  "value": 148,  "unit": "g/L" },
    { "code": "PLT",  "value": 280,  "unit": "×10⁹/L" },
    { "code": "CRP",  "value": 45,   "unit": "mg/L" }
  ]
}
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `reportId` | 否 | 报告编号，不提供则自动生成 |
| `patient.gender` | 否 | `"male"` 或 `"female"`，用于 HGB/RBC/HCT/ESR 性别校正 |
| `patient.age` | 否 | 年龄（0-150），用于 D-二聚体等指标的年龄校正 |
| `indicators[].code` | **是** | 指标代码，格式 `^[A-Z][A-Z0-9]{1,5}$` |
| `indicators[].value` | **是** | 检测数值 |
| `indicators[].unit` | **是** | 单位 |
| `indicators[].name` | 否 | 指标中文名，不提供则使用内置名称 |
| `indicators[].refRange` | 否 | 自定义参考范围，格式 `{"min": 0, "max": 10}`。不提供则使用 2023 指南默认值 |

### 支持的指标代码

| 分类 | 代码 |
|------|------|
| 白细胞 | `WBC` `NEUT` `NEUTP` `LYMPH` `LYMPHP` `MONO` `EO` `BASO` |
| 红细胞 | `RBC` `HGB` `HCT` `MCV` `MCH` `MCHC` `RDWCV` |
| 血小板 | `PLT` `MPV` `PCT` `PDW` |
| 凝血 | `PT` `APTT` `FIB` `DD` |
| 其他 | `RET` `ESR` `CRP` |

## 判级规则

| 等级 | 颜色 | 判定条件 |
|------|------|----------|
| 正常 (normal) | 绿色 | 参考范围内 |
| 偏高 (high) | 琥珀色 | > 参考上限且 ≤ 1.5× 上限 |
| 偏低 (low) | 蓝色 | < 参考下限且 ≥ 0.5× 下限 |
| 危急 (critical) | 红色 | > 1.5× 上限 或 < 0.5× 下限 |

## 关联预警规则

| 预警 | 条件 |
|------|------|
| 细菌性感染模式 | WBC↑ + NEUT↑ |
| 病毒性感染模式 | WBC↓ + LYMPH↑ |
| 小细胞低色素性贫血 | HGB↓ + MCV↓ + MCH↓ |
| 大细胞性贫血 | HGB↓ + MCV↑ |
| 正细胞性贫血 | HGB↓ + MCV 正常 |
| 全血细胞减少（三系减少） | WBC↓ + HGB↓ + PLT↓ |
| 血小板减少伴凝血异常 | PLT↓ + (PT↑ 或 APTT↑) |
| 炎症三联征 | WBC↑ + CRP↑ + ESR↑ |
| 缺铁性贫血可能性大 | HGB↓ + MCV↓ + RDWCV↑ |

## API 接口

### 分析

```
POST /api/analyze
Body: BloodReport (JSON)
Response: AnalysisResult
```

### 批量分析

```
POST /api/batch/analyze
Body: BloodReport[] (JSON 数组)
Response: { results: AnalysisResult[], total: number }
```

### AI 对话（流式）

```
POST /api/chat/stream
Body: { chatId: string, message: string, reportContext?: AnalysisResult }
Response: SSE 流 (text_delta, turn_end 事件)
```

### AI 对话（非流式）

```
POST /api/chat
Body: { chatId: string, message: string, reportContext?: AnalysisResult }
Response: { chatId: string, reply: string }
```

### 对话历史

```
GET /api/chat/:id/history
Response: { chatId: string, messages: ChatMessage[] }
```

### 健康检查

```
GET /api/health
Response: { status: "ok", timestamp: string }
```

## 运行测试

```bash
npm test
```

或直接运行：

```bash
cd engine && npx vitest run
```

## 免责声明

本工具仅供健康参考，不构成医疗诊断。如有异常指标请咨询专业医生。AI 对话生成的回复基于大语言模型，可能包含不准确信息，请以规则引擎的数值判级为准。

## 技术栈

| 层 | 技术 |
|----|------|
| 规则引擎 | TypeScript（零外部依赖） |
| 后端 | Express、OpenAI SDK（DeepSeek 兼容） |
| 前端 | React 18、Vite、Tailwind CSS |
| JSON 校验 | ajv（前端本地执行） |
| AI 模型 | DeepSeek v4 Flash（OpenAI 兼容 API） |
| 测试 | Vitest |
