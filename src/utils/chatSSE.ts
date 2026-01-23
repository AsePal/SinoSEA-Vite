// src/utils/chatSSE.ts
import type { SSEEvent } from '../pages/Chat';

export async function sendChatSSE(
  payload: {
    message: string;
    conversationId?: string;
    userId?: string; // ✅ 让 ChatWindow 传 userId 不再报错
  },
  onEvent: (event: SSEEvent) => void
) {
  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.body) throw new Error('SSE response has no body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // 支持两种格式：
    // 1) 纯 JSON 每行一个： {"type":"delta"...}\n
    // 2) SSE data 行： data: {"type":"delta"...}\n
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      const jsonText = line.startsWith('data:')
        ? line.replace(/^data:\s*/, '')
        : line;

      try {
        const evt = JSON.parse(jsonText) as SSEEvent;
        onEvent(evt);
      } catch {
        console.warn('Invalid SSE line:', jsonText);
      }
    }
  }
}
