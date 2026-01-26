import { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

/// 引入 SSE
import type { ChatMessage, SSEEvent } from '../types/chat.types';
import { sendChatSSE } from '../../../shared/api/chatSSE';

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ChatWindow({
  userAvatar,
  userId,
}: {
  userAvatar?: string;
  userId?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type SendPhase = 'idle' | 'out' | 'reset' | 'return';
  const [sendPhase, setSendPhase] = useState<SendPhase>('reset');
  const MAX_TEXTAREA_HEIGHT = 180; // ≈ 7~8 行，可自行调

  /* ------------ ------------ */

  function initConversation() {
    setMessages([
      {
        role: 'assistant',
        content: '你好呀！我是 **星洲智能助手** 🌟 有问题尽管问我 😎',
      },
    ]);
  }

  function handleNewChat() {
    setMessages([]);
    setConversationId(null);
    initConversation();
  }

  function handleSend() {
    if (loading) return;

    const value = input.trim();
    if (!value) return;

    triggerSendAnimation();
    sendMessage(value);
  }

  function triggerSendAnimation() {
    if (sendPhase !== 'idle') return;
    setSendPhase('out');
    setTimeout(() => setSendPhase('reset'), 400);
    setTimeout(() => setSendPhase('return'), 420);
    setTimeout(() => setSendPhase('idle'), 900);
  }

  function resizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';

    const newHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = newHeight + 'px';

    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
  }

  function resetTextareaHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
  }

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '你好呀！我是 **星洲智能助手** 🌟 有问题尽管问我 😎',
      },
    ]);
    initConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    requestAnimationFrame(() => setSendPhase('return'));
    const t = setTimeout(() => setSendPhase('idle'), 600);
    return () => clearTimeout(t);
  }, []);

  async function sendMessage(content: string) {
    let endReceived = false;
    let assistantText = '';

    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setInput('');
    requestAnimationFrame(resetTextareaHeight);

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '星洲正在思考⌛️',
        messageId: assistantMessageId,
      },
    ]);

    try {
      await sendChatSSE(
        {
          message: trimmed,
          conversationId: conversationId ?? undefined,
          userId,
        },
        (event: SSEEvent) => {
          if (event.type === 'delta') {
            assistantText += event.text;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.messageId === assistantMessageId ? { ...msg, content: assistantText } : msg,
              ),
            );
          }

          if (event.type === 'end') {
            endReceived = true;
            setConversationId(event.conversationId);
            setLoading(false);
          }
        },
      );

      if (!endReceived) setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  /* ---------------- UI（三层白拆分版） ---------------- */

  return (
    <div
      className="
    w-full h-full
    rounded-2xl
    bg-[#1c1c1e]
    backdrop-blur-xl
    border border-white/10
    shadow-[0_30px_80px_rgba(0,0,0,0.6)]
    flex flex-col
    text-gray-100
  "
    >
      {/* Header */}
      <div
        className="
        px-4 py-4
        text-sm font-semibold
       text-gray-300
        border-b border-white/10
      "
      >
        SionSEA-AI
        {conversationId && (
          <span className="ml-2 text-xs text-gray-400">当前会话 {conversationId.slice(0, 8)}…</span>
        )}
      </div>

      {/* Messages：主内容白 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/* ChatGPT 风格 Input Area */}
      <div className="px-4 py-3">
        <div
          className="
    flex items-start gap-3
    rounded-2xl
    bg-[#2b2b2e]
    border border-white/10
    px-3 py-2
    shadow-inner
  "
        >
          {/* 新对话（加号） */}
          <div className="self-end">
            <button
              type="button"
              onClick={handleNewChat}
              title="新对话"
              className="
      w-9 h-9
      rounded-full
      flex items-center justify-center
      bg-white/10 hover:bg-white/20
      text-white text-lg
      transition
    "
            >
              +
            </button>
          </div>

          {/* 输入框（无边框、无背景） */}
          <textarea
            rows={1}
            ref={textareaRef}
            value={input}
            placeholder="有问题，尽管问"
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => resizeTextarea(e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (!value) return;
                sendMessage(value);
              }
            }}
            className="
            flex-1
            resize-none
            bg-transparent
            border-none
            outline-none
           text-gray-100
           placeholder-gray-400
            leading-relaxed
            max-h-40
            overflow-y-auto
            chat-scroll
          "
          />

          {/* 发送按钮 */}
          <div className="self-end">
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="
      w-9 h-9
      rounded-full
      flex items-center justify-center
      bg-blue-600 hover:bg-blue-500
      disabled:opacity-40
      transition
    "
            >
              <PaperAirplaneIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* 底部提示文案（ChatGPT 同款位置） */}
        <p className="mt-2 text-xs text-gray-400 text-center">星洲也可能会犯错，请核查重要信息。</p>
      </div>
    </div>
  );
}
