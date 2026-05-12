import { useState, useCallback } from "react";
import type { AnalysisResult, BloodReport } from "@blood-report/shared";

interface UseAnalysisState {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    result: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(async (report: BloodReport) => {
    setState({ result: null, loading: true, error: null });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "分析请求失败");
      }
      const data: AnalysisResult = await res.json();
      setState({ result: data, loading: false, error: null });
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "网络错误";
      setState({ result: null, loading: false, error: msg });
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, analyze, clear };
}
