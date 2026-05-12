## 1. Shared Types & Data (Phase 0 — 串行，无依赖)

- [x] 1.1 Initialize monorepo root with package.json and tsconfig
- [x] 1.2 Create shared TypeScript types (BloodReport, Indicator, AnalysisResult, Alert, ReferenceRange)
- [x] 1.3 Create JSON Schema definition for blood report validation
- [x] 1.4 Create 2023 reference ranges data table (~25 core indicators with gender/age adjustments)
- [x] 1.5 Create shared constants (severity levels, unit mappings, indicator code enums)

## 2. Rule Engine (Phase 1 — 可并行，依赖 §1)

- [ ] 2.1 Implement reference range lookup with gender/age correction
- [ ] 2.2 Implement single-indicator analyzer (value → level: normal/high/critical/low)
- [ ] 2.3 Implement interpretation text generator (template per indicator code + level)
- [ ] 2.4 Implement multi-indicator correlation rules (infection pattern, anemia type, pancytopenia)
- [ ] 2.5 Implement main rule engine orchestrator (input BloodReport → output AnalysisResult)
- [ ] 2.6 Write unit tests for rule engine with known input/output pairs

## 3. Express Server Scaffold (Phase 1 — 可并行，依赖 §1)

- [ ] 3.1 Initialize server package with Express, TypeScript, dev scripts
- [ ] 3.2 Configure DeepSeek provider via pi-ai (baseURL: https://api.deepseek.com, model: deepseek-v4-flash)
- [ ] 3.3 Create pi agent session factory with medical system prompt
- [ ] 3.4 Implement SessionPool with TTL cleanup (Map<chatId, session>, 30min TTL, max 100)
- [ ] 3.5 Set up Express app with CORS, JSON body parser, error handling middleware
- [ ] 3.6 Create route scaffolds (analyze, chat, batch) with placeholder responses

## 4. API Routes (Phase 1 — 可并行，依赖 §3 + §2)

- [ ] 4.1 POST /api/analyze — accept validated report JSON, run rule engine, return AnalysisResult
- [ ] 4.2 POST /api/chat/stream — SSE endpoint: create/resume pi session, stream text_delta + turn_end events
- [ ] 4.3 POST /api/chat — non-streaming chat fallback endpoint
- [ ] 4.4 GET /api/chat/:id/history — return conversation message history
- [ ] 4.5 POST /api/batch/analyze — accept array of reports, run rule engine on each, return AnalysisResult[]

## 5. Custom Pi Tools (Phase 1 — 可并行，依赖 §3 + §2)

- [ ] 5.1 Define `analyze_blood_report` tool with TypeBox schema (calls rule engine)
- [ ] 5.2 Define `get_reference_range` tool with TypeBox schema (queries reference range DB)
- [ ] 5.3 Register custom tools in session factory and verify LLM can invoke them
- [ ] 5.4 Write medical system prompt (role, constraints, disclaimer requirement)

## 6. React Frontend — Setup & Theme (Phase 1 — 可并行，依赖 §1)

- [ ] 6.1 Scaffold React app with Vite + TypeScript + Tailwind CSS
- [ ] 6.2 Configure Tailwind theme: white/blue/green palette, medical-grade typography
- [ ] 6.3 Build reusable UI components: Badge (severity colors), Card, Button, Disclaimer
- [ ] 6.4 Create App layout shell (header, main content area, footer with disclaimer)

## 7. React Frontend — JSON Input & Validation (Phase 1 — 可并行，依赖 §6)

- [ ] 7.1 Build JsonInput component (large textarea, paste button, clear button)
- [ ] 7.2 Integrate ajv with blood report JSON Schema for frontend validation
- [ ] 7.3 Build validation error display (inline error list with field paths and fix hints)
- [ ] 7.4 Add sample data button (load demo valid JSON for quick testing)

## 8. React Frontend — Results Display (Phase 1 — 可并行，依赖 §6)

- [ ] 8.1 Build ReportTable component (sortable table with indicator code, name, value, unit, refRange, level badge)
- [ ] 8.2 Build AbnormalSummary component (cards grouped by severity, critical items first)
- [ ] 8.3 Build AlertBadge component with severity color + icon
- [ ] 8.4 Wire up useAnalysis hook (POST /api/analyze, loading/error/data states)

## 9. React Frontend — Chat Panel (Phase 1 — 可并行，依赖 §6)

- [ ] 9.1 Build ChatPanel component (message list, input box, send button)
- [ ] 9.2 Implement useChatStream hook (EventSource → SSE parsing, text_delta accumulation, turn_end handling)
- [ ] 9.3 Build streaming text rendering (token-by-token append with cursor animation)
- [ ] 9.4 Connect chat to current report context (send reportContext with each message)

## 10. React Frontend — Batch Mode (Phase 1 — 可并行，依赖 §8)

- [ ] 10.1 Build BatchTabs component (tab bar with report labels + critical count badges)
- [ ] 10.2 Build BatchOverview component (summary row showing all reports at a glance)
- [ ] 10.3 Wire up batch analysis flow (POST /api/batch/analyze → tab switching)

## 11. Integration & Polish (Phase 2 — 串行，依赖 §2-§10)

- [ ] 11.1 Start both client and server from single npm script (concurrently)
- [ ] 11.2 End-to-end test: paste valid JSON → analyze → view results → chat question
- [ ] 11.3 End-to-end test: paste invalid JSON → validation errors → fix → re-validate
- [ ] 11.4 End-to-end test: batch 3 reports → tab switching → independent analysis
- [ ] 11.5 Polish loading states and empty states across all components
- [ ] 11.6 Polish error states (network error, API unavailable, server error)
- [ ] 11.7 Final UI pass: spacing, typography, color consistency, responsive breakpoints
- [ ] 11.8 Add README with setup instructions and usage guide
