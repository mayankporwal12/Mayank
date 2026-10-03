# QYRON AI server-side provider

The API server can call OpenAI-compatible Chat Completions and image-generation endpoints. Provider credentials are read only by the API server; they are never included in API responses or frontend code.

Set these values on the server:

- `QYRON_AI_API_KEY` — provider key. Store it as a Replit Secret.
- `QYRON_AI_BASE_URL` — HTTPS API base URL, such as `https://provider.example/v1`.
- `QYRON_AI_MODEL` — model name accepted by that provider.

All three values are required for live mode. If any are missing or invalid, the status endpoint reports demo mode and QYRON continues using its local illustrative replies. The chat endpoint also applies a per-IP request limit and a 30-second provider timeout.

Use the provider's HTTPS API base URL without credentials, query parameters, or fragments. For example, `https://provider.example/v1` is expanded to `/chat/completions`. The provider must accept the OpenAI Chat Completions request and response shape.

The browser calls `/api/ai/status` before enabling live chat. When it reports `live`, user and assistant messages are posted to `/api/ai/chat`; the server calls the configured model and returns its reply. When it reports `demo`, the browser uses its local illustrative replies. Conversations continue to be stored in the browser's local storage, not in the API server.

## Optional image generation

Image generation uses its own server-side settings. It does not use the chat settings:

- `QYRON_IMAGE_API_KEY` — provider key; store it as a Replit Secret.
- `QYRON_IMAGE_BASE_URL` — HTTPS API base URL, such as `https://provider.example/v1`.
- `QYRON_IMAGE_MODEL` — image model name accepted by that provider.

All three are required. The server posts to `/images/generations` and requests base64 image output from an OpenAI-compatible endpoint. If any setting is missing or invalid, `POST /api/ai/images` returns HTTP 503 with `Image generation is not configured yet`. The endpoint accepts prompts up to 2,000 characters and only returns validated PNG, JPEG, or WebP bytes up to 8 MiB.

Generated image bytes and Blob URLs are not saved in conversation storage. An image preview lasts for the current browser session; the prompt and a non-image placeholder may remain in the local conversation history.