import type { ChatMessage } from "@workspace/api-zod";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_REPLY_LENGTH = 12_000;
const SYSTEM_PROMPT =
  "You are QYRON AI, a clear and helpful personal assistant. Reply in the language the user uses, including English, Hindi, or Hinglish. Use simple wording and practical steps when useful. Be transparent when you are uncertain, and do not claim to have taken actions you have not taken.";

type ProviderConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

type ProviderResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

export class AiProviderError extends Error {
  constructor(readonly upstreamStatus?: number) {
    super("AI provider request failed");
    this.name = "AiProviderError";
  }
}

function getProviderConfig(): ProviderConfig | null {
  const apiKey = process.env.QYRON_AI_API_KEY?.trim();
  const baseUrl = process.env.QYRON_AI_BASE_URL?.trim();
  const model = process.env.QYRON_AI_MODEL?.trim();

  if (!apiKey || !baseUrl || !model) {
    return null;
  }

  try {
    const url = new URL(baseUrl);
    const localDevelopmentHost = ["localhost", "127.0.0.1", "[::1]"].includes(
      url.hostname,
    );
    const isSecureProtocol =
      url.protocol === "https:" ||
      (process.env.NODE_ENV !== "production" &&
        url.protocol === "http:" &&
        localDevelopmentHost);

    if (
      !isSecureProtocol ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    const normalizedUrl = url.toString().replace(/\/+$/, "");
    const endpoint = normalizedUrl.endsWith("/chat/completions")
      ? normalizedUrl
      : `${normalizedUrl}/chat/completions`;

    return { apiKey, endpoint, model };
  } catch {
    return null;
  }
}

export function isAiConfigured(): boolean {
  return getProviderConfig() !== null;
}

export async function generateAiReply(messages: ChatMessage[]): Promise<string> {
  const config = getProviderConfig();
  if (!config) {
    throw new AiProviderError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AiProviderError(response.status);
    }

    const payload = (await response.json()) as ProviderResponse;
    const reply = payload.choices?.[0]?.message?.content;

    if (
      typeof reply !== "string" ||
      !reply.trim() ||
      reply.trim().length > MAX_REPLY_LENGTH
    ) {
      throw new AiProviderError(response.status);
    }

    return reply.trim();
  } catch (error) {
    if (error instanceof AiProviderError) {
      throw error;
    }
    throw new AiProviderError();
  } finally {
    clearTimeout(timeout);
  }
}