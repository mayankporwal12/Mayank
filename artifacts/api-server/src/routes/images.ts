import { CreateAiImageBody } from "@workspace/api-zod";
import { Router, type IRouter } from "express";
import {
  generateImage,
  ImageProviderError,
  isImageProviderConfigured,
} from "../lib/image-provider";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function allowImageRequest(clientId: string): boolean {
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

router.post("/ai/images", async (req, res): Promise<void> => {
  const parsed = CreateAiImageBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { issueCount: parsed.error.issues.length },
      "Invalid image generation request",
    );
    res.status(400).json({ error: "Enter an image prompt of up to 2000 characters." });
    return;
  }

  const prompt = parsed.data.prompt.trim();
  if (!prompt) {
    res.status(400).json({ error: "Enter a non-empty image prompt." });
    return;
  }

  if (!isImageProviderConfigured()) {
    res.status(503).json({ error: "Image generation is not configured yet" });
    return;
  }

  const clientId = req.ip || req.socket.remoteAddress || "unknown";
  if (!allowImageRequest(clientId)) {
    res.status(429).json({ error: "Image request limit reached. Try again shortly." });
    return;
  }

  try {
    const image = await generateImage(prompt);
    res
      .status(200)
      .set({
        "Content-Type": image.contentType,
        "Content-Length": String(image.bytes.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": 'inline; filename="qyron-generated-image"',
      })
      .send(image.bytes);
  } catch (error) {
    const upstreamStatus =
      error instanceof ImageProviderError ? error.upstreamStatus : undefined;
    req.log.warn({ upstreamStatus }, "Image provider request failed");
    res.status(502).json({ error: "Image provider could not generate an image." });
  }
});

export default router;