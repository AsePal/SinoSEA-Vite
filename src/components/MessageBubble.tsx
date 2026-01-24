import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../pages/Chat';
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
        <img
          src="/public/sionsealogo.ico"
          alt="AI"
          className="w-8 h-8 rounded-full shrink-0 mt-1"
        />
      )}

      {/* 消息容器 */}
      <div className="flex flex-col max-w-[92%] md:max-w-[75%] group">
        {/* 气泡 */}
        <div
          className={`
            rounded-xl px-4 py-3
            leading-relaxed break-words
            ${isUser
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-orange-500/20 border border-orange-500/30'}
          `}
        >
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* 复制按钮（AI + 用户通用） */}
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
            text-gray-200
            backdrop-blur
            ${isUser
              ? 'bg-blue-500/60 hover:bg-blue-500/80'
              : 'bg-black/60 hover:bg-black/80'}
          `}
        >
          {copied ? (
            <>
              <CheckIcon className="w-5 h-3" />
              已复制
            </>
          ) : (
            <>
              <ClipboardIcon className="w-5 h-3" />
              复制
            </>
          )}
        </button>
      </div>

      {/* 用户头像 */}
      {isUser && userAvatar && (
        <img
          src={userAvatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      )}
    </div>
  );
}
