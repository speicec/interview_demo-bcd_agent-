import OpenAI from "openai";
import { MEDICAL_SYSTEM_PROMPT } from "./medicalPrompt.js";

interface PoolEntry {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  lastAccess: number;
}

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_POOL_SIZE = 100;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const pool = new Map<string, PoolEntry>();

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [chatId, entry] of pool) {
      if (now - entry.lastAccess > TTL_MS) {
        pool.delete(chatId);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

export function getSession(chatId: string): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  let entry = pool.get(chatId);
  if (!entry) {
    // Evict oldest if at capacity
    if (pool.size >= MAX_POOL_SIZE) {
      let oldest: { id: string; time: number } | null = null;
      for (const [id, e] of pool) {
        if (!oldest || e.lastAccess < oldest.time) {
          oldest = { id, time: e.lastAccess };
        }
      }
      if (oldest) pool.delete(oldest.id);
    }

    entry = {
      messages: [
        { role: "system", content: MEDICAL_SYSTEM_PROMPT },
      ],
      lastAccess: Date.now(),
    };
    pool.set(chatId, entry);
    startCleanup();
  } else {
    entry.lastAccess = Date.now();
  }
  return entry.messages;
}

export function getHistory(chatId: string): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return pool.get(chatId)?.messages.slice(1) ?? []; // exclude system prompt
}

export function removeSession(chatId: string): void {
  pool.delete(chatId);
}

export function getPoolSize(): number {
  return pool.size;
}
