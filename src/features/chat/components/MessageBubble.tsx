import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types/chat.types';
import { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function MessageBubble({
  message,
  userAvatar,
}: {
  message: ChatMessage;
  userAvatar?: string;
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {/* AI 头像 */}
      {!isUser && (
        <img src="/sionsealogo.ico" alt="AI" className="w-8 h-8 rounded-full shrink-0 mt-1" />
      )}

      {/* 消息容器 */}
      <div className="flex flex-col max-w-[92%] md:max-w-[75%] group">
        {/* 气泡 */}
        <div
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* 复制按钮 */}
        <button
          onClick={handleCopy}
          className={`
            mt-1 self-end
            opacity-0 group-hover:opacity-100
            transition
            flex items-center gap-2
            px-3 py-1.5
            rounded-lg
            text-sm
            ${
              isUser
                ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white'
                : 'bg-white/70 text-gray-600 hover:bg-white dark:bg-gray-700/70 dark:text-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              已复制
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              复制
            </>
          )}
        </button>
      </div>

      {/* 用户头像 */}
      {isUser && userAvatar && (
        <img src={userAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
      )}
    </div>
  );
}
