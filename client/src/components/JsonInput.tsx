import { useState } from "react";
import Ajv from "ajv";
import { BLOOD_REPORT_SCHEMA } from "@blood-report/shared";
import type { BloodReport } from "@blood-report/shared";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { SAMPLE_REPORT } from "../data/sampleReport";

interface ValidationError {
  path: string;
  message: string;
}

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(BLOOD_REPORT_SCHEMA);

export function JsonInput({
  onSubmit,
  loading,
}: {
  onSubmit: (report: BloodReport) => void;
  loading: boolean;
}) {
  const [jsonText, setJsonText] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  function runValidation(text: string) {
    try {
      const parsed = JSON.parse(text);
      const valid = validate(parsed);
      if (!valid && validate.errors) {
        setErrors(
          validate.errors.map((e) => ({
            path: e.instancePath || "(root)",
            message: e.message ?? "未知校验错误",
          }))
        );
      } else {
        setErrors([]);
      }
    } catch {
      setErrors([{ path: "(root)", message: "JSON 格式解析失败，请检查语法" }]);
    }
  }

  function handleTextChange(text: string) {
    setJsonText(text);
    if (text.trim()) runValidation(text);
    else setErrors([]);
  }

  function handleSubmit() {
    if (errors.length > 0 || !jsonText.trim()) return;
    try {
      const report = JSON.parse(jsonText) as BloodReport;
      onSubmit(report);
    } catch {
      // won't happen: validated above
    }
  }

  function handleLoadSample() {
    const text = JSON.stringify(SAMPLE_REPORT, null, 2);
    setJsonText(text);
    runValidation(text);
  }

  function handlePaste() {
    navigator.clipboard.readText().then((text) => {
      setJsonText(text);
      runValidation(text);
    }).catch(() => {});
  }

  function handleClear() {
    setJsonText("");
    setErrors([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="serif-title text-base font-bold text-foreground">
          输入血常规报告
        </h2>
        <span className="text-xs text-muted-foreground">粘贴 JSON 格式数据</span>
      </div>

      <Textarea
        className="h-48"
        placeholder='{ "indicators": [{ "code": "WBC", "value": 6.5, "unit": "×10⁹/L" }, ...] }'
        value={jsonText}
        onChange={(e) => handleTextChange(e.target.value)}
        spellCheck={false}
      />

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="border border-danger/30 bg-danger/[0.06] rounded-sm p-3 space-y-1">
          <p className="text-xs font-semibold text-danger">
            发现 {errors.length} 个校验错误:
          </p>
          <ul className="list-disc list-inside text-xs text-danger space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>
                <code className="text-danger bg-danger/[0.08] px-1 rounded">{e.path}</code>
                {" — "}{e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Valid indicator */}
      {jsonText.trim() && errors.length === 0 && (
        <div className="border border-safe/30 bg-safe/[0.06] rounded-sm px-3 py-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-safe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs text-safe">JSON Schema 校验通过，可以提交分析</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={errors.length > 0 || !jsonText.trim() || loading}>
          {loading ? "分析中..." : "分析报告"}
        </Button>
        <Button variant="outline" onClick={handlePaste}>
          粘贴
        </Button>
        <Button variant="outline" onClick={handleLoadSample}>
          示例数据
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          清空
        </Button>
      </div>
    </div>
  );
}
