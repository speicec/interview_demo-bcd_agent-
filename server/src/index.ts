import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";
import chatRouter from "./routes/chat.js";
import batchRouter from "./routes/batch.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/api", analyzeRouter);
app.use("/api", chatRouter);
app.use("/api", batchRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "服务器内部错误",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`[server] Blood Report Agent API running on http://localhost:${PORT}`);
  console.log(`[server] DeepSeek: ${process.env.DEEPSEEK_API_KEY ? "configured" : "not configured (chat disabled)"}`);
});

export default app;
