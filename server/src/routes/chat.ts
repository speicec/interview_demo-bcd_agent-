import { Router } from "express";
import OpenAI from "openai";
import { DEEPSEEK_CONFIG, isDeepSeekConfigured } from "../config.js";
import { getSession, getHistory } from "../sessionPool.js";
import { analyzeReport } from "@blood-report/engine";
import type { AnalysisResult } from "@blood-report/shared";

const router = Router();

function getClient(): OpenAI {
  return new OpenAI({
    baseURL: DEEPSEEK_CONFIG.baseURL,
    apiKey: DEEPSEEK_CONFIG.apiKey,
  });
}

/**
 * Build a context message from rule engine analysis results.
 */
function buildReportContext(analysis: AnalysisResult): string {
  const lines: string[] = [
    `[规则引擎分析结果]`,
    `报告ID: ${analysis.reportId}`,
    `分析时间: ${analysis.analyzedAt}`,
  ];
  if (analysis.patient?.gender) {
    lines.push(`患者性别: ${analysis.patient.gender === "male" ? "男" : "女"}`);
  }
  if (analysis.patient?.age) {
    lines.push(`患者年龄: ${analysis.patient.age}岁`);
  }
  lines.push(`总指标数: ${analysis.summary.total}, 正常: ${analysis.summary.normal}, 异常: ${analysis.summary.abnormal}, 危急: ${analysis.summary.criticalCount}`);

  // Abnormal indicators
  const abnormal = analysis.indicators.filter((i) => i.level !== "normal");
  if (abnormal.length > 0) {
    lines.push("--- 异常指标 ---");
    for (const ind of abnormal) {
      const levelLabel = ind.level === "critical" ? "危急" : ind.level === "high" ? "偏高" : "偏低";
      lines.push(
        `${ind.name}(${ind.code}): ${ind.value} ${ind.unit} (参考范围: ${ind.refRange.min}-${ind.refRange.max}) [${levelLabel}]`
      );
      if (ind.interpretation) {
        lines.push(`  解读: ${ind.interpretation}`);
      }
    }
  }

  // Alerts
  if (analysis.alerts.length > 0) {
    lines.push("--- 关联预警 ---");
    for (const alert of analysis.alerts) {
      const sevLabel = alert.severity === "critical" ? "危急" : alert.severity === "warn" ? "警告" : "提示";
      lines.push(`[${sevLabel}] ${alert.title}: ${alert.description}`);
    }
  }

  return lines.join("\n");
}

/**
 * POST /api/chat/stream
 * SSE endpoint: stream text_delta + turn_end events.
 */
router.post("/chat/stream", async (req, res) => {
  if (!isDeepSeekConfigured()) {
    res.status(503).json({
      error: "AI对话服务暂未配置",
      message: "请设置 DEEPSEEK_API_KEY 环境变量",
    });
    return;
  }

  const { chatId, message, reportContext } = req.body as {
    chatId?: string;
    message?: string;
    reportContext?: AnalysisResult;
  };

  if (!chatId || !message) {
    res.status(400).json({
      error: "无效请求",
      message: "请提供 chatId 和 message",
    });
    return;
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const messages = getSession(chatId);

  // Inject report context if provided
  if (reportContext) {
    const contextText = buildReportContext(reportContext);
    messages.push({
      role: "system",
      content: `以下是最新的血常规规则引擎分析结果，请以此作为权威数据来源回答用户问题：\n\n${contextText}`,
    });
  }

  // Add user message
  messages.push({ role: "user", content: message });

  try {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model: DEEPSEEK_CONFIG.model,
      messages,
      max_tokens: DEEPSEEK_CONFIG.maxTokens,
      temperature: DEEPSEEK_CONFIG.temperature,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
        res.write(`event: text_delta\ndata: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    // Add assistant response to history
    messages.push({ role: "assistant", content: fullContent });

    res.write(`event: turn_end\ndata: ${JSON.stringify({})}\n\n`);
    res.end();
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "未知错误";
    res.write(`event: error\ndata: ${JSON.stringify({ message: errMsg })}\n\n`);
    res.end();
  }
});

/**
 * POST /api/chat — non-streaming chat fallback.
 */
router.post("/chat", async (req, res) => {
  if (!isDeepSeekConfigured()) {
    res.status(503).json({
      error: "AI对话服务暂未配置",
      message: "请设置 DEEPSEEK_API_KEY 环境变量",
    });
    return;
  }

  const { chatId, message, reportContext } = req.body as {
    chatId?: string;
    message?: string;
    reportContext?: AnalysisResult;
  };

  if (!chatId || !message) {
    res.status(400).json({
      error: "无效请求",
      message: "请提供 chatId 和 message",
    });
    return;
  }

  const messages = getSession(chatId);

  if (reportContext) {
    const contextText = buildReportContext(reportContext);
    messages.push({
      role: "system",
      content: `以下是最新的血常规规则引擎分析结果，请以此作为权威数据来源回答用户问题：\n\n${contextText}`,
    });
  }

  messages.push({ role: "user", content: message });

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: DEEPSEEK_CONFIG.model,
      messages,
      max_tokens: DEEPSEEK_CONFIG.maxTokens,
      temperature: DEEPSEEK_CONFIG.temperature,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    messages.push({ role: "assistant", content: reply });

    res.json({ chatId, reply });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "未知错误";
    res.status(500).json({ error: "对话请求失败", message: errMsg });
  }
});

/**
 * GET /api/chat/:id/history — return conversation message history.
 */
router.get("/chat/:id/history", (req, res) => {
  const { id } = req.params;
  const history = getHistory(id);
  res.json({ chatId: id, messages: history });
});

export default router;
