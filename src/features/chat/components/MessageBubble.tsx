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
            rounded-2xl
            px-5 py-3.5
            leading-relaxed
            break-words
            text-[15px] md:text-[16px]
            shadow-sm
            ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-800 text-black'}
          `}
        >
          <div className="prose max-w-none prose-p:my-1 prose-li:my-1 text-white">
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
            text-white
            ${isUser ? 'bg-blue-600/80 hover:bg-blue-600' : 'bg-gray-600/80 hover:bg-gray-600'}
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
