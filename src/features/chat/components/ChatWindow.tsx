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
  const { t } = useTranslation('chat');
  const navigate = useNavigate();

  const abortRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showLoginError, setShowLoginError] = useState(false);
  const [pendingToSend, setPendingToSend] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type SendPhase = 'idle' | 'out' | 'reset' | 'return';
  const [sendPhase, setSendPhase] = useState<SendPhase>('reset');

  const MAX_TEXTAREA_HEIGHT = 180;
  const disabled = loading || !input.trim();
  const [isFlying, setIsFlying] = useState(false);

  const welcomePlayedRef = useRef(false);

  const lastAuthedRef = useRef<boolean | null>(null);

  const GUEST_WELCOME_STEPS: WelcomeStep[] = [
    { content: '', delay: 0 },
    { content: '', delay: 1500 },
  ];

  const AUTHED_WELCOME_STEPS: WelcomeStep[] = [{ content: '', delay: 0 }];
  const guestTexts = t('welcome.guest', { returnObjects: true }) as string[];
  const authedTexts = t('welcome.authed', { returnObjects: true }) as string[];

  guestTexts.forEach((text, i) => {
    if (GUEST_WELCOME_STEPS[i]) {
      GUEST_WELCOME_STEPS[i].content = text;
    }
  });

  authedTexts.forEach((text, i) => {
    if (AUTHED_WELCOME_STEPS[i]) {
      AUTHED_WELCOME_STEPS[i].content = text;
    }
  });

  /* -------------------- 鉴权 -------------------- */

  function isAuthed() {
    const token = localStorage.getItem('auth_token');
    return Boolean(token) && Boolean(userId);
  }

  /* -------------------- 欢迎语（i18n） -------------------- */

  function playWelcomeSteps(steps: WelcomeStep[]) {
    setMessages([]);
    let totalDelay = 0;

    steps.forEach((step) => {
      totalDelay += step.delay;
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: step.content }]);
      }, totalDelay);
    });
  }

  function initConversation() {
    const authed = isAuthed();
    if (welcomePlayedRef.current && lastAuthedRef.current === authed) {
      return;
    }

    lastAuthedRef.current = authed;
    welcomePlayedRef.current = true;

    if (authed) {
      playWelcomeSteps(AUTHED_WELCOME_STEPS);
    } else {
      playWelcomeSteps(GUEST_WELCOME_STEPS);
    }
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

  useEffect(() => initConversation(), [userId, t]);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
  useEffect(() => () => abortRef.current?.abort(), []);

  /* -------------------- UI -------------------- */

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 text-sm font-semibold text-black/80 border-b border-white/20">
          SionSEA-AI
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3">
          <div
            className={`flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-2
            ${disabled ? 'bg-black/30' : 'bg-black/50'}`}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none bg-transparent outline-none text-gray-300 min-h-[40px]"
            />

            <button
              onClick={handleSend}
              disabled={disabled}
              className={`w-9 h-9 rounded-full flex items-center justify-center
              ${disabled ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <div className={isFlying ? 'animate-plane-fly' : ''}>
                <PaperAirplaneIcon
                  className={`w-4 h-4 -rotate-90 ${disabled ? 'text-gray-300' : 'text-white'}`}
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
