import { useState, useMemo } from "react";
import type { BloodReport, AnalysisResult } from "@blood-report/shared";
import { JsonInput } from "./components/JsonInput";
import { ReportTable } from "./components/ReportTable";
import { AbnormalSummary } from "./components/AbnormalSummary";
import { ChatPanel } from "./components/ChatPanel";
import { BatchTabs } from "./components/BatchTabs";
import { BatchOverview } from "./components/BatchOverview";
import { Card } from "./components/ui/Card";
import { Disclaimer } from "./components/ui/Disclaimer";
import { useAnalysis } from "./hooks/useAnalysis";

type BatchResult = { results: AnalysisResult[] };

export default function App() {
  const { result, loading, error, analyze, clear } = useAnalysis();
  const [batchResults, setBatchResults] = useState<BatchResult | null>(null);
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [mode, setMode] = useState<"single" | "batch">("single");

  const currentAnalysis = mode === "batch" && batchResults
    ? batchResults.results[activeBatchIndex] ?? null
    : result;

  async function handleSubmit(report: BloodReport) {
    // Check if input is a batch (array was parsed)
    const inputText = (document.querySelector("textarea") as HTMLTextAreaElement)?.value ?? "";
    try {
      const parsed = JSON.parse(inputText);
      if (Array.isArray(parsed)) {
        // Batch mode
        setMode("batch");
        setBatchResults(null);
        try {
          const res = await fetch("/api/batch/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: inputText,
          });
          if (!res.ok) throw new Error("批量分析失败");
          const data: { results: AnalysisResult[]; total: number } = await res.json();
          setBatchResults({ results: data.results });
          setActiveBatchIndex(0);
        } catch {
          // fallback
        }
        return;
      }
    } catch {
      // not JSON array, continue single
    }

    // Single mode
    setMode("single");
    setBatchResults(null);
    await analyze(report);
  }

  function handleClear() {
    clear();
    setBatchResults(null);
    setMode("single");
    setActiveBatchIndex(0);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">血常规报告解读助手</h1>
              <p className="text-xs text-gray-400">基于 2023 中国成人血常规参考标准</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentAnalysis && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                清空结果
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Input + Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* JSON Input */}
            <Card>
              <JsonInput onSubmit={handleSubmit} loading={loading} />
            </Card>

            {/* Loading */}
            {loading && (
              <Card>
                <div className="flex items-center gap-3 py-6 justify-center">
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">正在分析报告...</span>
                </div>
              </Card>
            )}

            {/* Error */}
            {error && (
              <Card>
                <div className="flex items-center gap-2 py-4 justify-center text-danger-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </Card>
            )}

            {/* Batch Display */}
            {mode === "batch" && batchResults && (
              <Card className="space-y-3">
                <BatchTabs
                  results={batchResults.results}
                  activeIndex={activeBatchIndex}
                  onChange={setActiveBatchIndex}
                />
                <BatchOverview results={batchResults.results} />
              </Card>
            )}

            {/* Single / Active Batch Report Results */}
            {currentAnalysis && (
              <>
                {/* Summary */}
                <Card title="异常概览">
                  <AbnormalSummary
                    indicators={currentAnalysis.indicators}
                    alerts={currentAnalysis.alerts}
                  />
                </Card>

                {/* Table */}
                <Card title="指标明细">
                  <ReportTable indicators={currentAnalysis.indicators} />
                </Card>
              </>
            )}

            {/* Empty state */}
            {!currentAnalysis && !loading && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">粘贴血常规 JSON 数据开始分析</p>
                <p className="text-xs mt-1">支持单份报告和批量报告（JSON 数组）</p>
              </div>
            )}
          </div>

          {/* Right: Chat Panel */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <Card>
                <ChatPanel reportContext={currentAnalysis} />
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
