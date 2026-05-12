import { useState, useCallback, useRef } from "react";
import type { AnalysisResult } from "@blood-report/shared";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseChatStreamState {
  messages: ChatMessage[];
  streaming: boolean;
  currentStream: string;
  error: string | null;
}

export function useChatStream() {
  const [state, setState] = useState<UseChatStreamState>({
    messages: [],
    streaming: false,
    currentStream: "",
    error: null,
  });
  const chatIdRef = useRef(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (message: string, reportContext?: AnalysisResult) => {
      if (!message.trim()) return;

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "user", content: message }],
        streaming: true,
        currentStream: "",
        error: null,
      }));

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: chatIdRef.current,
            message,
            reportContext,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message ?? "对话请求失败");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("无法读取响应流");

        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              const eventType = line.slice(7).trim();
              // The data line follows
              continue;
            }
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setState((prev) => ({
                    ...prev,
                    currentStream: fullContent,
                  }));
                }
              } catch {
                // skip empty data or parse errors
              }
            }
            // event: turn_end → finish
          }
        }

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            { role: "assistant", content: fullContent },
          ],
          streaming: false,
          currentStream: "",
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "网络错误";
        setState((prev) => ({
          ...prev,
          streaming: false,
          currentStream: "",
          error: msg,
        }));
      }
    },
    []
  );

  const clear = useCallback(() => {
    chatIdRef.current = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setState({ messages: [], streaming: false, currentStream: "", error: null });
  }, []);

  return { ...state, send, clear };
}
