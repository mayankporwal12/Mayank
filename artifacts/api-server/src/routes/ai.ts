import {
  CreateAiChatReplyBody,
  CreateAiChatReplyResponse,
  GetAiStatusResponse,
} from "@workspace/api-zod";
import { Router, type IRouter } from "express";
import {
  AiProviderError,
  generateAiReply,
  isAiConfigured,
} from "../lib/ai-provider";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function allowChatRequest(clientId: string): boolean {
  const now = Date.now();
  const current = requestWindows.get(clientId);

  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestWindows.set(clientId, { startedAt: now, count: 1 });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;

  if (requestWindows.size > 10_000) {
    for (const [key, window] of requestWindows) {
      if (now - window.startedAt >= RATE_LIMIT_WINDOW_MS) {
        requestWindows.delete(key);
      }
    }
  }

  return true;
}

router.get("/ai/status", (_req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  res.json(
    GetAiStatusResponse.parse({
      mode: isAiConfigured() ? "live" : "demo",
    }),
  );
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = CreateAiChatReplyBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ validationError: parsed.error.message }, "Invalid AI chat request");
    res.status(400).json({ error: "Invalid chat request" });
    return;
  }

  if (!isAiConfigured()) {
    res.json(CreateAiChatReplyResponse.parse({ mode: "demo", reply: null }));
    return;
  }

  const clientId = req.ip || req.socket.remoteAddress || "unknown";
  if (!allowChatRequest(clientId)) {
    res.status(429).json({ error: "Chat request limit reached. Try again shortly." });
    return;
  }

  try {
    const reply = await generateAiReply(parsed.data.messages);
    res.json(CreateAiChatReplyResponse.parse({ mode: "live", reply }));
  } catch (error) {
    const upstreamStatus =
      error instanceof AiProviderError ? error.upstreamStatus : undefined;
    req.log.warn({ upstreamStatus }, "AI provider request failed");
    res.status(502).json({ error: "AI provider is temporarily unavailable" });
  }
});

export default router;