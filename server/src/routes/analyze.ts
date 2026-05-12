import { Router } from "express";
import { analyzeReport } from "@blood-report/engine";
import type { BloodReport } from "@blood-report/shared";

const router = Router();

/**
 * POST /api/analyze
 * Accept validated report JSON, run rule engine, return AnalysisResult.
 */
router.post("/analyze", (req, res) => {
  try {
    const report = req.body as BloodReport;

    if (!report || !Array.isArray(report.indicators) || report.indicators.length === 0) {
      res.status(400).json({
        error: "无效的请求体",
        message: "请提供有效的血常规报告JSON，indicators 数组不能为空",
      });
      return;
    }

    const result = analyzeReport(report);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "分析失败",
      message: err instanceof Error ? err.message : "未知错误",
    });
  }
});

export default router;
