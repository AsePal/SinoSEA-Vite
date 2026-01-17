import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types/chat';

export default function MessageBubble({
  message,
  userAvatar
}: {
  message: ChatMessage;
  userAvatar?: string;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      
      {!isUser && (
        <img
        src='/public/sionsealogo.ico'
        alt='AI'
        className='w-8 h-8 rounded-full shrink-0 mt-1'/>
      )}

      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-orange-500/20 border border-orange-500/30'
          }`}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
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

