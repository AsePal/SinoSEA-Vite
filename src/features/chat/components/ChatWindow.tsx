import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

// ✅ 复用遗留弹窗
import LoginErrorModal from '../../auth/components/LoginErrorModal';

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
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showLoginError, setShowLoginError] = useState(false);
  const [pendingToSend, setPendingToSend] = useState<string>('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type SendPhase = 'idle' | 'out' | 'reset' | 'return';
  const [sendPhase, setSendPhase] = useState<SendPhase>('reset');
  const MAX_TEXTAREA_HEIGHT = 180;

  const disabled = loading || !input.trim() || !isAuthed();
  const [isFlying, setIsFlying] = useState(false);

  // 飞机触发动画✈️
  function handleSend() {
    if (disabled) return;

    const value = input.trim();

    if (!isAuthed()) {
      blockAndAskLogin(value);
      return;
    }

    setIsFlying(true); //起飞✈️
    triggerSendAnimation();
    sendMessage(value);

    setTimeout(() => {
      setIsFlying(false); //飞回来
    }, 1800);
  }

  /* -------------------- 核心工具函数 -------------------- */

  function initConversation() {
    setMessages([
      {
        role: 'assistant',
        content: '你好呀！我是 **星洲智能助手** 🌟 有问题尽管问我 😎',
      },
    ]);
  }

  function isAuthed() {
    const token = localStorage.getItem('auth_token');
    return Boolean(token) && Boolean(userId);
  }

  function blockAndAskLogin(content: string) {
    setPendingToSend(content);
    setShowLoginError(true);
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

  /* -------------------- 初始化 -------------------- */

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* -------------------- 🔥 登录后自动发送闭环 -------------------- */

  useEffect(() => {
    if (!isAuthed()) return;

    const pending = sessionStorage.getItem('pending_chat_message');
    if (!pending) return;

    // 清理，防止重复
    sessionStorage.removeItem('pending_chat_message');

    // 触发自动发送
    triggerSendAnimation();
    sendMessage(pending);
  }, [userId]); // userId 出现，意味着登录态已就绪

  /* -------------------- 发送逻辑 -------------------- */

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

  /* -------------------- UI -------------------- */

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 text-sm font-semibold text-black/80 border-b border-white/20 ">
          asepal-AI
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 chat-scroll">
          <div
            className={` flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-2 transition-colors
            ${disabled ? 'bg-black/30' : 'bg-black/50'}
          `}
          >
            {/* 👇 就加在这里 */}
            {!isAuthed() && (
              <p className="mt-2 text-xs text-gray-500 text-center">🔒会话功能需要登录使用</p>
            )}
            <textarea
              rows={1}
              ref={textareaRef}
              value={input}
              placeholder={isAuthed() ? 'Enter发送，Shift+Enter换行' : ''}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => resizeTextarea(e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none bg-transparent outline-none text-gray-300 min-h-\[40px\] leading-\[40px\] py-0"
            />
            <div className="relative group self-end overflow-visible">
              <button
                onClick={handleSend}
                disabled={disabled}
                className={`relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center transition
                ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
              >
                <div className={isFlying ? 'animate-plane-fly' : ''}>
                  <PaperAirplaneIcon
                    className={` w-4 h-4 -rotate-90 transition
                  ${disabled ? 'text-gray-300' : 'text-white'}
                `}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 未登录弹窗 */}
      <LoginErrorModal
        open={showLoginError}
        onCancel={() => setShowLoginError(false)}
        onConfirm={() => {
          setShowLoginError(false);
          if (pendingToSend) {
            sessionStorage.setItem('pending_chat_message', pendingToSend);
          }
          navigate('/login');
        }}
      />
    </>
  );
}
