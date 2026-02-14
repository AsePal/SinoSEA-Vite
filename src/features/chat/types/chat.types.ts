/* ---------- 聊天消息类型 ---------- */

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
  messageId?: string;
};

export type ChatHistoryMessage = {
  id: string;
  role: ChatRole;
  type: 'text';
  content: string;
};

/* ---------- 历史对话 ---------- */

export type ChatConversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type ChatConversationListResponse = {
  hasMore: boolean;
  items: ChatConversation[];
};

export type ChatHistoryResponse = {
  data: {
    conversationId: string;
    hasMore: boolean;
    items: ChatHistoryMessage[];
  };
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
