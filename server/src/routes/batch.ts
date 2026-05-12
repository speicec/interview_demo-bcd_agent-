import { Router } from "express";
import { analyzeReport } from "@blood-report/engine";
import type { BloodReport } from "@blood-report/shared";

const router = Router();

/**
 * POST /api/batch/analyze
 * Accept array of reports, run rule engine on each, return AnalysisResult[].
 */
router.post("/batch/analyze", (req, res) => {
  try {
    const reports = req.body as unknown;

    if (!Array.isArray(reports) || reports.length === 0) {
      res.status(400).json({
        error: "无效请求",
        message: "请提供血常规报告数组",
      });
      return;
    }

    const results = reports.map((report: BloodReport, index: number) => {
      try {
        return analyzeReport(report);
      } catch (err) {
        return {
          reportId: report.reportId ?? `batch-${index}`,
          error: err instanceof Error ? err.message : "分析失败",
        };
      }
    });

    res.json({ results, total: results.length });
  } catch (err) {
    res.status(500).json({
      error: "批量分析失败",
      message: err instanceof Error ? err.message : "未知错误",
    });
  }
});

export default router;
