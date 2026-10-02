const REQUEST_TIMEOUT_MS = 90_000;
const MAX_PROVIDER_RESPONSE_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type ImageProviderConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

type ImageProviderResponse = {
  data?: Array<{
    b64_json?: unknown;
  }>;
};

export type GeneratedImage = {
  bytes: Buffer;
  contentType: "image/png" | "image/jpeg" | "image/webp";
};

export class ImageProviderError extends Error {
  constructor(readonly upstreamStatus?: number) {
    super("Image provider request failed");
    this.name = "ImageProviderError";
  }
}

function getImageProviderConfig(): ImageProviderConfig | null {
  const apiKey = process.env.QYRON_IMAGE_API_KEY?.trim();
  const baseUrl = process.env.QYRON_IMAGE_BASE_URL?.trim();
  const model = process.env.QYRON_IMAGE_MODEL?.trim();

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
    const endpoint = normalizedUrl.endsWith("/images/generations")
      ? normalizedUrl
      : `${normalizedUrl}/images/generations`;

    return { apiKey, endpoint, model };
  } catch {
    return null;
  }
}

export function isImageProviderConfigured(): boolean {
  return getImageProviderConfig() !== null;
}

async function readProviderJson(response: Response): Promise<ImageProviderResponse> {
  const contentLength = Number(response.headers.get("content-length"));
  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_PROVIDER_RESPONSE_BYTES
  ) {
    throw new ImageProviderError(response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ImageProviderError(response.status);
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_PROVIDER_RESPONSE_BYTES) {
        await reader.cancel();
        throw new ImageProviderError(response.status);
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as ImageProviderResponse;
  } catch {
    throw new ImageProviderError(response.status);
  }
}

function detectImageContentType(
  bytes: Buffer,
): GeneratedImage["contentType"] | null {
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return "image/png";
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function decodeGeneratedImage(value: unknown): GeneratedImage {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 4 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(value)
  ) {
    throw new ImageProviderError();
  }

  const bytes = Buffer.from(value, "base64");
  const canonicalBase64 = bytes.toString("base64").replace(/=+$/, "");
  if (
    bytes.length === 0 ||
    bytes.length > MAX_IMAGE_BYTES ||
    canonicalBase64 !== value.replace(/=+$/, "")
  ) {
    throw new ImageProviderError();
  }

  const contentType = detectImageContentType(bytes);
  if (!contentType) {
    throw new ImageProviderError();
  }

  return { bytes, contentType };
}

export async function generateImage(prompt: string): Promise<GeneratedImage> {
  const config = getImageProviderConfig();
  if (!config) {
    throw new ImageProviderError();
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
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ImageProviderError(response.status);
    }

    const payload = await readProviderJson(response);
    return decodeGeneratedImage(payload.data?.[0]?.b64_json);
  } catch (error) {
    if (error instanceof ImageProviderError) {
      throw error;
    }
    throw new ImageProviderError();
  } finally {
    clearTimeout(timeout);
  }
}