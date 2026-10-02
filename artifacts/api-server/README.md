# QYRON AI server-side provider

The API server can call an OpenAI-compatible Chat Completions endpoint. Provider credentials are read only by the API server; they are never included in API responses or frontend code.

Set these values on the server:

- `QYRON_AI_API_KEY` — provider key. Store it as a Replit Secret.
- `QYRON_AI_BASE_URL` — HTTPS API base URL, such as `https://provider.example/v1`.
- `QYRON_AI_MODEL` — model name accepted by that provider.

All three values are required for live mode. If any are missing or invalid, the status endpoint reports demo mode and QYRON continues using its local illustrative replies. The chat endpoint also applies a per-IP request limit and a 30-second provider timeout.

The browser calls only `/api/ai/status` and `/api/ai/chat`; it must never receive the provider key. Chat messages are sent to the configured provider only in live mode. Conversations continue to be stored in the browser's local storage, not in the API server.