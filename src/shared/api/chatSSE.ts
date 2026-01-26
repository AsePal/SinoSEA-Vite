import type { SSEEvent } from '../../features/chat/types/chat.types';
import API from './config';

export async function sendChatSSE(
  payload: {
    message: string;
    conversationId?: string;
    userId?: string;
  },
  onEvent: (event: SSEEvent) => void
) {
  const controller = new AbortController();

  // ⭐ 1️⃣ 记录最近一次收到数据的时间
  let lastActivity = Date.now();

  // ⭐ 2️⃣ 空闲超时检测（30 秒无数据才断）
  const idleTimeout = 30000;

  const idleChecker = setInterval(() => {
    if (Date.now() - lastActivity > idleTimeout) {
      controller.abort();
    }
  }, 5000);

  const res = await fetch(API.chat.stream, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  });

  if (!res.ok) {
    clearInterval(idleChecker);
    throw new Error(`SSE request failed: ${res.status}`);
  }

  if (!res.body) {
    clearInterval(idleChecker);
    throw new Error('SSE response has no body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      if (value) {
        // ⭐ 3️⃣ 只要收到任何字节，就认为“活跃”
        lastActivity = Date.now();

        buffer += decoder.decode(value, { stream: true });

        // ⭐ 4️⃣ 正确分割 SSE 事件（支持 \n\n 和 \r\n\r\n）
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          const line = rawEvent.trim();
          if (!line.startsWith('data:')) continue;

          const jsonText = line.replace(/^data:\s*/, '');
          const event = JSON.parse(jsonText) as SSEEvent;

          onEvent(event);

          // ⭐ 5️⃣ 收到 end，直接结束循环
          if (event.type === 'end') {
            return;
          }
        }
      }
    }
  } finally {
    // ⭐ 6️⃣ 清理定时器，避免内存泄漏
    clearInterval(idleChecker);
  }
}
