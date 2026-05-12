import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import type { AnalysisResult } from "@blood-report/shared";
import { useChatStream } from "../hooks/useChatStream";

export function ChatPanel({ reportContext }: { reportContext?: AnalysisResult | null }) {
  const { messages, streaming, currentStream, error, send, clear } = useChatStream();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStream]);

  function handleSend() {
    if (!input.trim() || streaming) return;
    send(input.trim(), reportContext ?? undefined);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="serif-title text-base font-bold text-foreground">
          AI 对话
        </h3>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            清空对话
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[200px] max-h-[400px]">
        {messages.length === 0 && !streaming && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <svg className="w-8 h-8 mx-auto mb-2 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <p>输入问题追问报告详情</p>
            <p className="text-xs mt-1 text-muted-foreground/50">如："WBC偏高是什么意思？"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary border-l-4 border-l-primary/30 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streaming && currentStream && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-secondary border-l-4 border-l-primary/30 rounded-lg px-3 py-2 text-sm text-foreground">
              {currentStream}
              <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-blink-cursor align-text-bottom" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-xs text-danger py-2">
            {error}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder="输入问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming}
        />
        <Button onClick={handleSend} disabled={!input.trim() || streaming}>
          {streaming ? "..." : "发送"}
        </Button>
      </div>
    </div>
  );
}
