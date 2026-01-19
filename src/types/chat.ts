export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
// src/types/chat.ts

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  typing?: boolean; // 👈 给回复动画用
}
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  typing?: boolean;
  loading?: boolean; // 👈 新增
}
