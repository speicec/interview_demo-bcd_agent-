/**
 * DeepSeek provider configuration.
 * Uses OpenAI-compatible API at api.deepseek.com.
 */
export const DEEPSEEK_CONFIG = {
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  model: "deepseek-v4-flash" as const,
  maxTokens: 2048,
  temperature: 0.3,
} as const;

export function isDeepSeekConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}
