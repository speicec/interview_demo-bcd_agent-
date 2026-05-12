export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-secondary/30 border border-border rounded-sm text-xs text-muted-foreground">
      <svg className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
      <span>本工具仅供健康参考，不构成医疗诊断。如有异常指标请咨询专业医生。</span>
    </div>
  );
}
