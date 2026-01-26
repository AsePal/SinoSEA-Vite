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

  /* ------------ 逻辑完全未改 ------------ */

  function handleSend() {
    if (loading || !input.trim()) return;
    triggerSendAnimation();
    sendMessage();
  }

  function triggerSendAnimation() {
    if (sendPhase !== 'idle') return;
    setSendPhase('out');
    setTimeout(() => setSendPhase('reset'), 400);
    setTimeout(() => setSendPhase('return'), 420);
    setTimeout(() => setSendPhase('idle'), 900);
  }

  function autoResizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
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
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    requestAnimationFrame(() => setSendPhase('return'));
    const t = setTimeout(() => setSendPhase('idle'), 600);
    return () => clearTimeout(t);
  }, []);

  async function sendMessage() {
    let endReceived = false;
    let assistantText = '';
    const content = input.trim();
    if (!content || loading) return;

    setLoading(true);
    setInput('');
    requestAnimationFrame(resetTextareaHeight);

    setMessages((prev) => [...prev, { role: 'user', content }]);

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '星洲正在思考⌛️', messageId: assistantMessageId },
    ]);

    try {
      await sendChatSSE(
        { message: content, conversationId: conversationId ?? undefined, userId },
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
        rounded-xl
        bg-[linear-gradient(#fafafa,#f6f6f6)]
        backdrop-blur-sm
        shadow-[0_8px_30px_rgba(0,0,0,0.15)]
        flex flex-col
      "
    >
      {/* Header：功能白 */}
      <div
        className="
          px-4 py-4
          bg-white/80
          backdrop-blur
          text-gray-700
          text-sm font-semibold
          border-b border-gray-200/60
        "
      >
        SionSEA-AI
        {conversationId && (
          <span className="ml-2 text-xs text-gray-400">会话 {conversationId.slice(0, 8)}…</span>
        )}
      </div>

      {/* Messages：主内容白 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area：功能白 */}
      <div
        className="
          px-4 py-3
          bg-gray-90
          backdrop-blur
          border-t border-gray-200/60
          flex gap-3
          items-end
        "
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResizeTextarea();
          }}
          rows={1}
          placeholder="（Enter 发送，Shift+Enter 换行）"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="
            flex-1 resize-none
            rounded-lg
            bg-white/90
            border border-gray-300/60
            p-3
            text-gray-900
            placeholder-gray-400
            min-h-\[44px\] max-h-40
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="
            relative w-11 h-11
            rounded-full
            bg-blue-600 hover:bg-blue-500
            flex items-center justify-center
            disabled:opacity-40
          "
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
