import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types/chat.types';
import { useEffect, useRef, useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function MessageBubble({
  message,
  userAvatar,
  isActive,
  onActivate,
}: {
  message: ChatMessage;
  userAvatar?: string;
  isActive?: boolean;
  onActivate?: () => void;
}) {
  const isUser = message.role === 'user';
  const normalizedContent = message.content.trim();
  const waitingTextMatch = normalizedContent.match(/^(.*?)(?:\.\.\.|…)\s*$/);
  const shouldAnimateWaitingDots =
    !isUser &&
    (normalizedContent === '...' ||
      (normalizedContent.startsWith('AsePal') && Boolean(waitingTextMatch)));
  const waitingText =
    normalizedContent === '...' ? '' : (waitingTextMatch?.[1] ?? normalizedContent);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(Boolean(isActive));
  const menuRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<number | null>(null);

  function handleCopy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setMenuOpen(true);
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        setMenuOpen(false);
      }, 1500);
    });
  }

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: Event) => {
      if (!menuRef.current) return;
      const path = (event as Event & { composedPath?: () => EventTarget[] }).composedPath?.();
      if (path?.includes(menuRef.current)) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (isActive) {
      setMenuVisible(true);
      return;
    }
    setMenuVisible(false);
    setMenuOpen(false);
  }, [isActive]);

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
      initial={isUser ? { opacity: 0, y: 10 } : { opacity: 0, y: 6 }}
      animate={isUser ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={
        isUser
          ? { type: 'spring', stiffness: 320, damping: 24 }
          : { type: 'tween', duration: 0.25, ease: 'easeOut' }
      }
    >
      {/* AI 头像 */}
      {!isUser && (
        <img src="/sionsealogo.ico" alt="AI" className="w-8 h-8 rounded-full shrink-0 mt-1" />
      )}

      {/* 消息容器 */}
      <div className="flex flex-col max-w-[calc(100%-80px)] md:max-w-[calc(75%-80px)]">
        {/* 气泡 */}
        <div
          onClick={() => {
            onActivate?.();
            setMenuVisible(true);
            setMenuOpen(false);
          }}
          className={`
            max-w-full
            rounded-[24px]
            px-6 py-2.5
            leading-relaxed
            break-words
            text-[15px] md:text-[16px]
            ${
              isUser
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
            }
          `}
        >
          <div
            className={`
              prose max-w-none
              prose-p:my-0.5 prose-li:my-0.5
              ${isUser ? 'text-white dark:text-gray-900' : 'text-gray-800 dark:text-gray-100'}
            `}
          >
            {shouldAnimateWaitingDots ? (
              <span className="inline-flex items-center gap-0.5">
                {waitingText ? <span>{waitingText}</span> : null}
                <span className="inline-flex" aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <motion.span
                      key={index}
                      className="inline-block text-[18px] leading-none"
                      animate={{ y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
                      transition={{
                        duration: 0.75,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.15,
                      }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              </span>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>

        {/* 操作菜单（气泡外底部左侧展开） */}
        {menuVisible && (
          <div className="mt-1 flex items-center">
            <div ref={menuRef} className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={`
                  inline-flex items-center justify-center
                  w-6 h-6 rounded-md
                  text-xs font-semibold
                  transition-colors
                  ${
                    isUser
                      ? 'text-white/80 hover:text-white dark:text-gray-700 dark:hover:text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }
                `}
                aria-label="打开操作菜单"
                title="操作"
              >
                ···
              </button>

              {menuOpen && (
                <div
                  className={`
                    ml-2
                    flex items-center gap-1
                    px-2 py-1
                    rounded-lg
                    text-xs
                    shadow-sm
                    origin-left
                    transition
                    ${
                      isUser
                        ? 'bg-gray-900 text-white/90 dark:bg-gray-100 dark:text-gray-900'
                        : 'bg-white/90 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {copied ? (
                      <CheckIcon className="w-3.5 h-3.5" />
                    ) : (
                      <ClipboardIcon className="w-3.5 h-3.5" />
                    )}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 用户头像 */}
      {isUser && userAvatar && (
        <img src={userAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
      )}
    </motion.div>
  );
}
