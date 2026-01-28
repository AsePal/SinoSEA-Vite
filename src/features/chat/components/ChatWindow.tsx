import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

// ✅ 复用遗留弹窗
import LoginErrorModal from '../../auth/components/LoginErrorModal';

/// 引入 SSE
import type { ChatMessage, SSEEvent } from '../types/chat.types';
import { sendChatSSE } from '../../../shared/api/chatSSE';

// 定义默认回复内容的时间间隔
type WelcomeStep = {
  content: string;
  delay: number; // ms
};

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
  const abortRef = useRef<AbortController | null>(null);

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

  const disabled = loading || !input.trim();
  const [isFlying, setIsFlying] = useState(false);
  const welcomePlayedRef = useRef(false);
  // 记录上一次登录状态
  const lastAuthedRef = useRef<boolean | null>(null);

  // 定义欢迎语样式1（未登录状态）
  const GUEST_WELCOME_STEPS: WelcomeStep[] = [
    {
      content: '你好呀！我是 **星洲智能助手** 🌟',
      delay: 0,
    },
    {
      content: '我可以为你解答校园的规章制度、校园周边生活，同时还是你的小小心理指导老师',
      delay: 1500,
    },
  ];
  //样式2（已登录状态）
  const AUTHED_WELCOME_STEPS: WelcomeStep[] = [
    {
      content: '你好呀！我是 **星洲智能助手** 🌟',
      delay: 0,
    },
  ];

  // 欢迎语
  function playWelcomeSteps(steps: WelcomeStep[]) {
    setMessages([]); // 清空当前对话（新会话）

    let totalDelay = 0;

    steps.forEach((step) => {
      totalDelay += step.delay;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: step.content,
          },
        ]);
      }, totalDelay);
    });
  }

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
    const authed = isAuthed();

    // 登录状态没变 → 不重复播
    if (lastAuthedRef.current === authed) return;

    lastAuthedRef.current = authed;
    welcomePlayedRef.current = false;

    if (authed) {
      playWelcomeSteps(AUTHED_WELCOME_STEPS);
    } else {
      playWelcomeSteps(GUEST_WELCOME_STEPS);
    }
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
  // 初始化信息
  useEffect(() => {
    if (!isAuthed()) return;

    const pending = sessionStorage.getItem('pending_chat_message');
    if (!pending) return;

    sessionStorage.removeItem('pending_chat_message');

    // 稍微延迟，确保欢迎语 / UI 已 ready
    setTimeout(() => {
      sendMessage(pending);
    }, 300);
  }, [userId]);

  /* -------------------- 初始化 -------------------- */
  // 组件卸载时中断 SSE
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    initConversation();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* -------------------- 发送逻辑 -------------------- */
  async function sendMessage(content: string) {
    let assistantText = '';

    const trimmed = content.trim();
    if (!trimmed || loading) return;

    // 🔒 中断上一条未完成的 SSE（防止并发卡死）
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

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
            setConversationId(event.conversationId);
          }
        },
        {
          signal: controller.signal, // ⭐ 关键：把 abort 传进去
        },
      );
    } catch (err) {
      // ❗️任何异常，都给一个“不中断对话”的提示
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === assistantMessageId
            ? {
                ...msg,
                content: assistantText || '⚠️ 回复中断（网络异常或超时），你可以继续提问。',
              }
            : msg,
        ),
      );
    } finally {
      // 🔥 灵魂所在：无论成功 / 失败 / 超时，都必须解锁
      setLoading(false);
      abortRef.current = null;
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
              className="flex-1 resize-none bg-transparent outline-none text-gray-300 min-h-[40px] leading-[40px] py-0"
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
