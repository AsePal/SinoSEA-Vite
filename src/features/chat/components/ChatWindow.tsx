import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

// 复用遗留弹窗
import LoginErrorModal from '../../auth/components/LoginErrorModal';

// SSE
import type { ChatMessage, SSEEvent } from '../types/chat.types';
import { sendChatSSE } from '../../../shared/api/chatSSE';
import type { TFunction } from 'i18next';
function getWelcomeSteps(t: TFunction, authed: boolean): WelcomeStep[] {
  if (authed) {
    return [
      {
        content: t('welcome.authed.line1'),
        delay: 0,
      },
    ];
  }

  return [
    {
      content: t('welcome.guest.line1'),
      delay: 0,
    },
    {
      content: t('welcome.guest.line2'),
      delay: 1500,
    },
  ];
}

type WelcomeStep = {
  content: string;
  delay: number;
};

export default function ChatWindow({
  userAvatar,
  userId,
}: {
  userAvatar?: string;
  userId?: string;
}) {
  const { t, i18n } = useTranslation('chat');
  const navigate = useNavigate();

  const abortRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasUserChatted = messages.some((m) => m.role === 'user');
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const [showLoginError, setShowLoginError] = useState(false);
  const [pendingToSend, setPendingToSend] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const welcomeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  type SendPhase = 'idle' | 'out' | 'reset' | 'return';
  const [sendPhase, setSendPhase] = useState<SendPhase>('reset');

  const MAX_TEXTAREA_HEIGHT = 180;
  const disabled = loading || !input.trim();
  const [isFlying, setIsFlying] = useState(false);

  const welcomePlayedRef = useRef(false);

  const lastAuthedRef = useRef<boolean | null>(null);
  const lastLangRef = useRef<string | null>(null);

  /* -------------------- 鉴权 -------------------- */

  function isAuthed() {
    const token = localStorage.getItem('auth_token');
    return Boolean(token);
  }

  /* -------------------- 欢迎语（i18n） -------------------- */

  function playWelcomeSteps(steps: WelcomeStep[]) {
    // 清空之前的所有待执行的 timeout
    welcomeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    welcomeTimeoutsRef.current = [];

    setMessages([]);
    let totalDelay = 0;

    steps.forEach((step) => {
      totalDelay += step.delay;
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: step.content }]);
      }, totalDelay);
      welcomeTimeoutsRef.current.push(timeout);
    });
  }

  function initConversation() {
    // 语言动作切换控制台打印
    // console.log('initConversation called');
    const authed = isAuthed();
    const currentLang = i18n.resolvedLanguage || i18n.language;

    // 🚫 如果已经播过，并且「登录状态 + 语言」都没变，就不重播
    if (
      welcomePlayedRef.current &&
      lastAuthedRef.current === authed &&
      lastLangRef.current === currentLang
    ) {
      return;
    }

    lastAuthedRef.current = authed;
    lastLangRef.current = currentLang;
    welcomePlayedRef.current = true;

    const steps = getWelcomeSteps(t, authed);
    playWelcomeSteps(steps);
  }

  /* -------------------- 输入区工具 -------------------- */

  function resizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    const h = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = h + 'px';
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
  }

  function resetTextareaHeight() {
    textareaRef.current && (textareaRef.current.style.height = 'auto');
  }

  function triggerSendAnimation() {
    if (sendPhase !== 'idle') return;
    setSendPhase('out');
    setTimeout(() => setSendPhase('reset'), 400);
    setTimeout(() => setSendPhase('return'), 420);
    setTimeout(() => setSendPhase('idle'), 900);
  }

  function blockAndAskLogin(content: string) {
    setPendingToSend(content);
    setShowLoginError(true);
  }

  /* -------------------- 发送 -------------------- */

  function handleSend() {
    if (disabled) return;

    const value = input.trim();
    if (!isAuthed()) {
      blockAndAskLogin(value);
      return;
    }

    setIsFlying(true);
    setAutoScroll(true);
    triggerSendAnimation();
    sendMessage(value);

    setTimeout(() => setIsFlying(false), 1800);
  }

  async function sendMessage(content: string) {
    let assistantText = '';
    if (!content || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setInput('');
    requestAnimationFrame(resetTextareaHeight);

    setMessages((prev) => [...prev, { role: 'user', content }]);

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: t('system.thinking'),
        messageId: assistantMessageId,
      },
    ]);

    try {
      await sendChatSSE(
        { message: content, conversationId: conversationId ?? undefined, userId },
        (event: SSEEvent) => {
          if (event.type === 'delta') {
            assistantText += event.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.messageId === assistantMessageId ? { ...m, content: assistantText } : m,
              ),
            );
          }
          if (event.type === 'end') {
            setConversationId(event.conversationId);
          }
        },
        { signal: controller.signal },
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === assistantMessageId
            ? {
                ...m,
                content: assistantText || t('system.timeout'),
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  /* -------------------- 生命周期 -------------------- */

  useEffect(() => {
    // 挂载时重置所有状态，强制播放欢迎语
    welcomePlayedRef.current = false;
    lastAuthedRef.current = null;
    lastLangRef.current = null;
    initConversation();
  }, []);

  useEffect(() => {
    if (!hasUserChatted) {
      initConversation();
    }
  }, [i18n.language, hasUserChatted]);

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, autoScroll]);
  useEffect(() => {
    if (!messages.length) {
      setActiveMessageId(null);
      return;
    }
    const lastIndex = messages.length - 1;
    const lastMessageId = messages[lastIndex].messageId ?? `index-${lastIndex}`;
    setActiveMessageId(lastMessageId);
  }, [messages]);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    return () => {
      welcomeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          {conversationId ? conversationId.substring(0, 8) : '...'}
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll"
          onScroll={() => {
            const el = scrollContainerRef.current;
            if (!el) return;
            const threshold = 24;
            const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
            setAutoScroll(isNearBottom);
          }}
        >
          {messages.map((msg, i) => {
            const messageId = msg.messageId ?? `index-${i}`;
            const isActive = messageId === activeMessageId;

            return (
              <MessageBubble
                key={messageId}
                message={msg}
                userAvatar={userAvatar}
                isActive={isActive}
                onActivate={() => setActiveMessageId(messageId)}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3">
          <div
            className={`flex items-end gap-3 rounded-2xl border px-3 py-2
            ${
              disabled
                ? 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
            }`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              placeholder={
                isAuthed() ? t('input.placeholder_authed') : `🔒 ${t('input.login_required')}`
              }
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => resizeTextarea(e.currentTarget)}
              onFocus={() => {
                if (!isAuthed()) {
                  blockAndAskLogin('');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="chat-input flex-1 resize-none bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[24px] leading-6"
            />

            <button
              onClick={handleSend}
              disabled={disabled}
              className={`w-9 h-9 rounded-full flex items-center justify-center self-end
              ${
                disabled
                  ? 'bg-gray-300 text-gray-500 dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <div className={isFlying ? 'animate-plane-fly' : ''}>
                <PaperAirplaneIcon
                  className={`w-4 h-4 -rotate-90 ${disabled ? 'text-gray-500 dark:text-gray-300' : 'text-white'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <LoginErrorModal
        open={showLoginError}
        onCancel={() => setShowLoginError(false)}
        onConfirm={() => {
          setShowLoginError(false);
          pendingToSend && sessionStorage.setItem('pending_chat_message', pendingToSend);
          navigate('/login');
        }}
      />
    </>
  );
}
