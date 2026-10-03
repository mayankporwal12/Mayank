import { buildDemoReply } from './demo-responses.js';

const STORAGE_KEY_PREFIX = 'qyron-ai-conversations-v1';
const SESSION_IMAGE_LIMIT = 8;

export function mountQyronChat(root, { userId, userName, onLogout } = {}) {
if (!(root instanceof HTMLElement)) throw new Error('QYRON chat needs a mount element.');
if (typeof userId !== 'string' || !userId) throw new Error('A signed-in user is required to mount QYRON chat.');
if (typeof onLogout !== 'function') throw new Error('QYRON chat needs a logout handler.');

const storageKey = `${STORAGE_KEY_PREFIX}:${encodeURIComponent(userId)}`;
const imageUrls = new Map();
const displayName = String(userName || '').trim() || 'Your account';

root.innerHTML = `
  <div class="app-shell">
    <aside class="sidebar" id="sidebar" aria-label="Conversation history">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"><i></i></span>
         <div><div class="brand-name">QYRON AI</div><div class="brand-tag">Intelligence, Reimagined.</div></div>
      </div>
      <button class="new-chat" id="new-chat" type="button" data-testid="button-new-chat">
        <span class="plus-icon" aria-hidden="true">+</span><span>New conversation</span>
         <span style="margin-left:auto;color:#9aabb5;font:9px var(--font-mono)">Ctrl K</span>
      </button>
      <div class="side-label"><span>Recent threads</span><span id="thread-count">0</span></div>
      <div class="conversation-list" id="conversation-list" role="list"></div>
      <div class="sidebar-footer">
        <div class="local-note"><span class="local-dot"></span><span>Private by default.<br>Saved on this device.</span></div>
        <div class="sidebar-footline">QYRON / PREVIEW BUILD 0.1</div>
      </div>
    </aside>
    <div class="mobile-scrim" id="mobile-scrim" aria-hidden="true"></div>
    <main class="main-area">
      <header class="topbar">
        <div class="top-left">
          <button type="button" class="mobile-menu" id="mobile-menu" aria-label="Open conversation history" aria-expanded="false" data-testid="button-open-history">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
           <span class="workspace-label">QYRON AI · PERSONAL CHAT</span>
           <span class="mobile-brand" aria-label="QYRON AI — Intelligence, Reimagined.">
             <span class="mobile-brand-name">QYRON AI</span>
             <span class="mobile-brand-tag">Intelligence, Reimagined.</span>
           </span>
        </div>
         <div class="top-right">
           <div class="top-status"><span class="status-dot"></span><span id="ai-mode-label">DEMO MODE · NO LIVE AI</span></div>
           <div class="chat-account-actions">
             <span class="chat-account-name" title="${escapeHtml(displayName)}">${escapeHtml(displayName)}</span>
             <button class="chat-logout" id="chat-logout" type="button" data-testid="button-logout">Log out</button>
           </div>
         </div>
      </header>
      <section class="conversation-stage" aria-label="Chat conversation">
        <div class="messages-scroll" id="messages-scroll" aria-live="polite"></div>
        <div class="composer-wrap">
          <form class="composer" id="composer" aria-label="Write a message">
             <textarea id="message-input" rows="1" aria-label="Message QYRON AI" placeholder="Ask in English, हिंदी, or Hinglish…"></textarea>
            <div class="composer-bottom">
              <span class="composer-hint">ENTER TO SEND&nbsp; · &nbsp;SHIFT + ENTER FOR A NEW LINE</span>
              <div class="composer-actions">
                <button class="image-button" id="image-button" type="button" aria-label="Generate an image from this prompt" disabled data-testid="button-generate-image">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3.5" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="7.2" cy="7.5" r="1.2" fill="currentColor"/><path d="m4.5 14 3.8-3.8 2.4 2.4 1.8-1.8 3 3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>Image</span>
                </button>
                <button class="send-button" id="send-button" type="submit" aria-label="Send message" disabled data-testid="button-send-message">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15.7V4.3M5.5 8.8 10 4.3l4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </form>
           <p class="demo-disclaimer" id="demo-disclaimer"><strong>Demo mode:</strong> QYRON AI is not connected to a live AI. Replies are illustrative only.</p>
        </div>
      </section>
    </main>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const elements = {
  list: root.querySelector('#conversation-list'),
  count: root.querySelector('#thread-count'),
  messages: root.querySelector('#messages-scroll'),
  input: root.querySelector('#message-input'),
  send: root.querySelector('#send-button'),
  image: root.querySelector('#image-button'),
  composer: root.querySelector('#composer'),
  sidebar: root.querySelector('#sidebar'),
  scrim: root.querySelector('#mobile-scrim'),
  menu: root.querySelector('#mobile-menu'),
  toast: root.querySelector('#toast'),
  modeLabel: root.querySelector('#ai-mode-label'),
  disclaimer: root.querySelector('#demo-disclaimer'),
  logout: root.querySelector('#chat-logout'),
};

let conversations = loadConversations();
let activeId = null;
let toastTimer;
let aiMode = 'demo';
let isSending = false;
let pendingConversationId = null;
let pendingAction = null;

function loadConversations() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved.filter((item) => item && item.id && Array.isArray(item.messages)) : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  } catch {
    showToast('Could not save locally. Browser storage may be full.');
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function startConversation() {
  const now = new Date().toISOString();
  const conversation = { id: makeId(), title: 'New conversation', createdAt: now, updatedAt: now, messages: [] };
  conversations.unshift(conversation);
  activeId = conversation.id;
  persist();
  render();
  closeSidebar();
  elements.input.focus();
}

function selectConversation(id) {
  activeId = id;
  render();
  closeSidebar();
  elements.input.focus();
}

function deleteConversation(id) {
  const item = conversations.find((conversation) => conversation.id === id);
  if (!item) return;
  if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
  item.messages.forEach((message) => {
    if (message.imageResultId) forgetImageResult(message.imageResultId);
  });
  conversations = conversations.filter((conversation) => conversation.id !== id);
  if (activeId === id) activeId = null;
  persist();
  render();
}

function renderSidebar() {
  elements.count.textContent = String(conversations.length).padStart(2, '0');
  if (!conversations.length) {
    elements.list.innerHTML = '<p class="sidebar-empty">Your conversations will appear here. Start with a question or a half-formed thought.</p>';
    return;
  }
  elements.list.innerHTML = conversations.map((conversation) => `
    <div class="conversation-item ${conversation.id === activeId ? 'active' : ''}" role="listitem">
      <button class="conversation-select" type="button" data-select="${escapeHtml(conversation.id)}" aria-current="${conversation.id === activeId ? 'page' : 'false'}" title="${escapeHtml(conversation.title)}">${escapeHtml(conversation.title)}</button>
      <button class="delete-chat" type="button" data-delete="${escapeHtml(conversation.id)}" aria-label="Delete ${escapeHtml(conversation.title)}" title="Delete conversation">×</button>
    </div>`).join('');
}

function renderWelcome() {
  const modeLabel = aiMode === 'live' ? 'Live AI' : 'Demo';
  const welcomeCopy = aiMode === 'live'
    ? 'Welcome to QYRON AI. Bring a question, an idea, or a plan you want to think through. English, हिंदी, ya Hinglish — start wherever feels natural. Replies come from the configured AI provider.'
    : 'Welcome to QYRON AI. Bring a question, an idea, or a plan you want to think through. English, हिंदी, ya Hinglish — start wherever feels natural. This is a demo; replies are examples, not live AI.';
  elements.messages.innerHTML = `
    <div class="welcome">
      <div class="eyebrow"><span class="eyebrow-line"></span> Intelligence, Reimagined. · ${modeLabel}</div>
      <h1>Socho, poochho.<br><span>Find your next step.</span></h1>
      <p class="welcome-copy">${welcomeCopy}</p>
      <div class="starter-label">Try a starting point / यहाँ से शुरू करें</div>
      <div class="suggestions">
        <button class="suggestion" type="button" data-prompt="Help me turn a rough idea into one small first step."><span>01 / THINK IT THROUGH</span>Help me shape a rough idea</button>
        <button class="suggestion" type="button" data-prompt="Mujhe padhai ke liye ek simple weekly plan banane mein help karo."><span>02 / HINGLISH</span>Mere liye ek simple study plan banao</button>
        <button class="suggestion" type="button" data-prompt="मुझे एक नई आदत शुरू करनी है। पहला आसान कदम क्या हो सकता है?"><span>03 / हिंदी</span>एक नई आदत शुरू करने का आसान तरीका</button>
        <button class="suggestion" type="button" data-prompt="Explain a confusing idea in simple English with one everyday example."><span>04 / KEEP IT CLEAR</span>Explain something without the jargon</button>
      </div>
    </div>`;
}

function formatReply(text) {
  const safe = escapeHtml(text);
  return safe
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`).join('')}</ul>`;
      }
      const formatted = lines.join('<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
      return `<p>${formatted}</p>`;
    }).join('');
}

function renderMessages() {
  const conversation = conversations.find((item) => item.id === activeId);
  if (!conversation || !conversation.messages.length) {
    renderWelcome();
    return;
  }
  const renderedMessages = conversation.messages.map((message) => {
    const isUser = message.role === 'user';
    const imageUrl = message.imageResultId ? imageUrls.get(message.imageResultId) : null;
    const content = isUser
      ? escapeHtml(message.content).replace(/\n/g, '<br>')
      : message.imageResultId
        ? imageUrl
          ? `<figure class="generated-image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(message.imagePrompt || 'Generated image')}" loading="lazy"><figcaption>Generated image</figcaption></figure>`
          : '<p class="image-preview-unavailable">This image preview is only available in the current session. Image files are not saved in conversation history.</p>'
        : formatReply(message.content);
    return `<article class="message ${isUser ? 'user' : 'assistant'}" data-message-id="${escapeHtml(message.id)}">
      ${isUser ? '' : '<span class="message-mark" aria-hidden="true">Q</span>'}
      <div class="message-body">
        <div class="message-meta">${isUser ? 'YOU' : message.imageResultId ? 'QYRON AI · IMAGE' : message.demo ? 'QYRON AI · DEMO REPLY' : 'QYRON AI'}</div>
        <div class="message-content ${isUser ? '' : 'reply-content'} ${message.imageGenerationError ? 'image-generation-error' : ''}">${content}</div>
        ${message.demo ? '<span class="demo-tag">DEMO EXAMPLE · NOT LIVE AI</span>' : ''}
        <div class="message-tools"><button type="button" class="copy-button" data-copy="${escapeHtml(message.id)}" aria-label="Copy ${isUser ? 'your message' : message.demo ? 'demo reply' : 'assistant reply'}">Copy text</button></div>
      </div>
       ${isUser ? '<span class="message-mark" aria-hidden="true">Y</span>' : ''}
    </article>`;
  }).join('');
  const pendingReply = isSending && pendingConversationId === conversation.id
    ? `<article class="message assistant pending-message" aria-label="QYRON AI is responding"><span class="message-mark" aria-hidden="true">Q</span><div class="message-body"><div class="message-meta">QYRON AI</div><div class="message-content reply-content">${pendingAction === 'image' ? 'Generating image…' : 'Thinking…'}</div></div></article>`
    : '';
  elements.messages.innerHTML = `${renderedMessages}${pendingReply}`;
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function render() {
  renderSidebar();
  renderMessages();
}

async function sendMessage(content) {
  const clean = content.trim();
  if (!clean || isSending) return;
  let conversation = conversations.find((item) => item.id === activeId);
  if (!conversation) {
    const now = new Date().toISOString();
    conversation = { id: makeId(), title: clean.replace(/\s+/g, ' ').slice(0, 42) || 'New conversation', createdAt: now, updatedAt: now, messages: [] };
    conversations.unshift(conversation);
    activeId = conversation.id;
  }
  const now = new Date().toISOString();
  if (!conversation.messages.length) conversation.title = clean.replace(/\s+/g, ' ').slice(0, 42) + (clean.length > 42 ? '…' : '');
  conversation.messages.push({ id: makeId(), role: 'user', content: clean, createdAt: now });
  conversation.updatedAt = now;
  conversations = [conversation, ...conversations.filter((item) => item.id !== conversation.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  persist();
  elements.input.value = '';
  isSending = true;
  pendingConversationId = conversation.id;
  pendingAction = 'chat';
  elements.input.disabled = true;
  resizeInput();
  render();

  let reply = '';
  let isDemoReply = true;
  let showFallbackNotice = false;

  if (aiMode === 'live') {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          messages: conversation.messages
            .filter((message) => message.role === 'user' || message.role === 'assistant')
            .slice(-12)
            .map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('AI chat request failed');

      if (result.mode === 'live' && typeof result.reply === 'string' && result.reply.trim()) {
        reply = result.reply.trim();
        isDemoReply = false;
      } else {
        showFallbackNotice = true;
        updateAiMode('demo');
      }
    } catch {
      showFallbackNotice = true;
    }
  }

  if (!reply) reply = buildDemoReply(clean);
  conversation.messages.push({
    id: makeId(),
    role: 'assistant',
    content: reply,
    createdAt: new Date().toISOString(),
    demo: isDemoReply,
  });
  conversation.updatedAt = new Date().toISOString();
  conversations = [conversation, ...conversations.filter((item) => item.id !== conversation.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  persist();
  isSending = false;
  pendingConversationId = null;
  pendingAction = null;
  render();

  elements.input.disabled = false;
  resizeInput();
  elements.input.focus();
  if (showFallbackNotice) showToast('AI service unavailable. Using a local demo reply.');
}

function forgetImageResult(imageId) {
  const imageUrl = imageUrls.get(imageId);
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrls.delete(imageId);
}

async function generateImageFromPrompt(content) {
  const clean = content.trim();
  if (!clean || isSending) return;

  let conversation = conversations.find((item) => item.id === activeId);
  if (!conversation) {
    const now = new Date().toISOString();
    conversation = { id: makeId(), title: clean.replace(/\s+/g, ' ').slice(0, 42) || 'New conversation', createdAt: now, updatedAt: now, messages: [] };
    conversations.unshift(conversation);
    activeId = conversation.id;
  }

  const now = new Date().toISOString();
  if (!conversation.messages.length) conversation.title = clean.replace(/\s+/g, ' ').slice(0, 42) + (clean.length > 42 ? '…' : '');
  conversation.messages.push({ id: makeId(), role: 'user', content: clean, createdAt: now });
  conversation.updatedAt = now;
  conversations = [conversation, ...conversations.filter((item) => item.id !== conversation.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  persist();

  elements.input.value = '';
  isSending = true;
  pendingAction = 'image';
  pendingConversationId = conversation.id;
  elements.input.disabled = true;
  resizeInput();
  render();

  try {
    const response = await fetch('/api/ai/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'image/png, image/jpeg, image/webp, application/json' },
      body: JSON.stringify({ prompt: clean }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(typeof result?.error === 'string' ? result.error : 'Image generation failed.');
    }

    const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(contentType)) {
      throw new Error('Image provider returned an unsupported image.');
    }
    const blob = await response.blob();
    if (blob.size === 0 || blob.size > 8 * 1024 * 1024) {
      throw new Error('Image provider returned an unsupported image.');
    }

    const imageId = makeId();
    imageUrls.set(imageId, URL.createObjectURL(blob));
    while (imageUrls.size > SESSION_IMAGE_LIMIT) {
      forgetImageResult(imageUrls.keys().next().value);
    }
    conversation.messages.push({
      id: makeId(),
      role: 'assistant',
      content: `Generated image for: ${clean}`,
      imageResultId: imageId,
      imagePrompt: clean,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    conversation.messages.push({
      id: makeId(),
      role: 'assistant',
      content: error instanceof Error ? error.message : 'Image generation failed.',
      imageGenerationError: true,
      createdAt: new Date().toISOString(),
    });
  } finally {
    conversation.updatedAt = new Date().toISOString();
    conversations = [conversation, ...conversations.filter((item) => item.id !== conversation.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    persist();
    isSending = false;
    pendingAction = null;
    pendingConversationId = null;
    elements.input.disabled = false;
    render();
    resizeInput();
    elements.input.focus();
  }
}

function resizeInput() {
  elements.input.style.height = 'auto';
  elements.input.style.height = `${Math.min(elements.input.scrollHeight, 160)}px`;
  elements.send.disabled = isSending || !elements.input.value.trim();
  elements.image.disabled = isSending || !elements.input.value.trim();
}

function updateAiMode(mode) {
  aiMode = mode;
  if (mode === 'live') {
    elements.modeLabel.textContent = 'LIVE AI · CONFIGURED';
    elements.disclaimer.textContent = 'Live AI mode: messages are sent to the configured provider for replies.';
  } else {
    elements.modeLabel.textContent = 'DEMO MODE · NO LIVE AI';
    elements.disclaimer.innerHTML = '<strong>Demo mode:</strong> QYRON AI is not connected to a live AI. Replies are illustrative only.';
  }
  render();
}

async function loadAiMode() {
  try {
    const response = await fetch('/api/ai/status', { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok) return;
    const status = await response.json();
    if (status.mode === 'live') updateAiMode('live');
  } catch {
    // The local demo stays available when the API server is offline.
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('visible'), 1900);
}

function openSidebar() {
  elements.sidebar.classList.add('open');
  elements.scrim.classList.add('visible');
  elements.menu.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  elements.sidebar.classList.remove('open');
  elements.scrim.classList.remove('visible');
  elements.menu.setAttribute('aria-expanded', 'false');
}

elements.list.addEventListener('click', (event) => {
  const select = event.target.closest('[data-select]');
  const remove = event.target.closest('[data-delete]');
  if (select) selectConversation(select.dataset.select);
  if (remove) deleteConversation(remove.dataset.delete);
});
elements.messages.addEventListener('click', (event) => {
  const suggestion = event.target.closest('[data-prompt]');
  const copy = event.target.closest('[data-copy]');
  if (suggestion) {
    elements.input.value = suggestion.dataset.prompt;
    resizeInput();
    elements.input.focus();
  }
  if (copy) {
    const conversation = conversations.find((item) => item.id === activeId);
    const message = conversation?.messages.find((item) => item.id === copy.dataset.copy);
     if (message) {
       if (navigator.clipboard?.writeText) {
         navigator.clipboard.writeText(message.content).then(() => showToast('Message copied to clipboard.')).catch(() => showToast('Clipboard access is unavailable.'));
       } else {
         showToast('Clipboard access is unavailable.');
       }
     }
  }
});
elements.composer.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(elements.input.value);
});
elements.image.addEventListener('click', () => generateImageFromPrompt(elements.input.value));
elements.input.addEventListener('input', resizeInput);
elements.input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (elements.input.value.trim()) sendMessage(elements.input.value);
  }
});
root.querySelector('#new-chat').addEventListener('click', startConversation);
elements.menu.addEventListener('click', () => elements.sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
elements.scrim.addEventListener('click', closeSidebar);
elements.logout.addEventListener('click', onLogout);
function handleDocumentKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    startConversation();
  }
  if (event.key === 'Escape') closeSidebar();
}
document.addEventListener('keydown', handleDocumentKeydown);
render();
void loadAiMode();

return () => {
  document.removeEventListener('keydown', handleDocumentKeydown);
  clearTimeout(toastTimer);
  imageUrls.forEach((url) => URL.revokeObjectURL(url));
  imageUrls.clear();
  root.replaceChildren();
};
}