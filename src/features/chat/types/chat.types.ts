/* ---------- 聊天消息类型 ---------- */

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
  messageId?: string;
};

/* ---------- SSE 事件类型 ---------- */

export type SSEStartEvent = {
  type: 'start';
  conversationId: string;
  messageId: string;
};

export type SSEDletaEvent = {
  type: 'delta';
  text: string;
};

export type SSEEndEvent = {
  type: 'end';
  conversationId: string;
  messageId: string;
};

export type SSEEvent = SSEStartEvent | SSEDletaEvent | SSEEndEvent;
