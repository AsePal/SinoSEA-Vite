import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

// 复用遗留弹窗
import LoginErrorModal from '../../auth/components/LoginErrorModal';

// SSE
import type { ChatMessage, SSEEvent, ChatHistoryMessage } from '../types/chat.types';
import { sendChatSSE } from '../../../shared/api/chatSSE';
import type { TFunction } from 'i18next';
import { fetchChatMessages } from '../../../shared/api/chat';
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

type ChatWindowProps = {
  userAvatar?: string;
  conversationId?: string | null;
  onConversationIdChange?: (id: string | null) => void;
};

export default function ChatWindow({
  userAvatar,
  conversationId: conversationIdProp,
  onConversationIdChange,
}: ChatWindowProps) {
  const { t, i18n } = useTranslation('chat');
  const navigate = useNavigate();

  const abortRef = useRef<AbortController | null>(null);
  const streamBufferRef = useRef('');
  const assistantTextRef = useRef('');
  const activeAssistantIdRef = useRef<string | null>(null);
  const streamFlushTimerRef = useRef<number | null>(null);
  const isStreamingRef = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasUserChatted = messages.some((m) => m.role === 'user');
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(conversationIdProp ?? null);
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

  const [historyLoading, setHistoryLoading] = useState(false);
  const historyLoadingRef = useRef(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyHasMore, setHistoryHasMore] = useState(false);

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

    // 重置消息和会话ID，开始新对话
    setMessages([]);
    setConversationId(null);

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

    // 如果外部指定了会话，跳过欢迎语
    if (conversationIdProp) {
      return;
    }

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  const loadHistory = useCallback(
    async (conversationIdValue: string, reset = false) => {
      if (historyLoadingRef.current) return;

      historyLoadingRef.current = true;
      setHistoryLoading(true);
      setHistoryError(null);

      try {
        const firstId = reset ? undefined : messages.length > 0 ? messages[0].messageId : undefined;

        const res = await fetchChatMessages({
          conversationId: conversationIdValue,
          firstId,
          limit: 20,
        });

        const { items, hasMore } = res.data;
        const mapped: ChatMessage[] = items.map((m: ChatHistoryMessage) => ({
          role: m.role,
          content: m.content,
          messageId: m.id,
        }));

        setHistoryHasMore(hasMore);
        setMessages((prev) => (reset ? mapped : [...mapped, ...prev]));
      } catch (err) {
        setHistoryError(t('system.error'));
      } finally {
        historyLoadingRef.current = false;
        setHistoryLoading(false);
      }
    },
    [messages, t],
  );

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
    if (!content || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setInput('');
    requestAnimationFrame(resetTextareaHeight);

    setMessages((prev) => [...prev, { role: 'user', content }]);

    const assistantMessageId = crypto.randomUUID();
    assistantTextRef.current = '';
    streamBufferRef.current = '';
    activeAssistantIdRef.current = assistantMessageId;
    isStreamingRef.current = true;
    startAssistantFlushTimer();
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
        { message: content, conversationId: conversationId ?? undefined },
        (event: SSEEvent) => {
          // start 事件：保存 conversationId（首次对话时）
          if (event.type === 'start' && !conversationId) {
            setConversationId(event.conversationId);
            onConversationIdChange?.(event.conversationId);
          }
          if (event.type === 'delta') {
            streamBufferRef.current += event.text;
          }
          // end 事件：也保存 conversationId（兜底）
          if (event.type === 'end') {
            setConversationId(event.conversationId);
            onConversationIdChange?.(event.conversationId);
          }
        },
        { signal: controller.signal },
      );
    } catch (err) {
      console.error('[Chat SSE Error]', err);
      flushAssistantBuffer();
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === assistantMessageId
            ? {
                ...m,
                content: assistantTextRef.current || t('system.timeout'),
              }
            : m,
        ),
      );
    } finally {
      flushAssistantBuffer();
      stopAssistantFlushTimer();
      setLoading(false);
      isStreamingRef.current = false;
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
    if (!conversationIdProp) return;
    if (conversationIdProp === conversationId) return;

    abortRef.current?.abort();
    setConversationId(conversationIdProp);
    setMessages([]);
    setHistoryHasMore(false);
    setHistoryError(null);
    historyLoadingRef.current = false;
    setHistoryLoading(false);
    welcomePlayedRef.current = true; // 避免重播欢迎语
    loadHistory(conversationIdProp, true);
  }, [conversationIdProp, conversationId, loadHistory]);

  useEffect(() => {
    if (!hasUserChatted) {
      initConversation();
    }
  }, [i18n.language, hasUserChatted]);

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: isStreamingRef.current ? 'auto' : 'smooth' });
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
      stopAssistantFlushTimer();
    };
  }, []);

  function flushAssistantBuffer() {
    if (!activeAssistantIdRef.current || !streamBufferRef.current) return;
    assistantTextRef.current += streamBufferRef.current;
    streamBufferRef.current = '';
    const nextText = assistantTextRef.current;
    const targetId = activeAssistantIdRef.current;
    setMessages((prev) =>
      prev.map((m) => (m.messageId === targetId ? { ...m, content: nextText } : m)),
    );
  }

  function startAssistantFlushTimer() {
    if (streamFlushTimerRef.current !== null) return;
    streamFlushTimerRef.current = window.setInterval(() => {
      flushAssistantBuffer();
    }, 50);
  }

  function stopAssistantFlushTimer() {
    if (streamFlushTimerRef.current === null) return;
    window.clearInterval(streamFlushTimerRef.current);
    streamFlushTimerRef.current = null;
  }

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
          {historyHasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => conversationId && loadHistory(conversationId, false)}
                disabled={historyLoading}
                className="text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 disabled:opacity-60"
              >
                {historyLoading ? t('sidebar.loadingHistory') : t('sidebar.loadMore')}
              </button>
            </div>
          )}

          {historyError && (
            <div className="text-xs text-center text-red-500 dark:text-red-400">{historyError}</div>
          )}

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
              className={`w-6 h-6 rounded-full flex items-center justify-center self-end
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
