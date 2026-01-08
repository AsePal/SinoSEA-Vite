import { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../types/chat';

const CHAT_API = 'http://api.sionsea-ai.cn:3000/chat';

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /** 自动滚动到底部 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /** 首次欢迎语 */
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '你好！我是 **星洲智能助手** 🌟\n\n可以直接向我提问。'
      }
    ]);
  }, []);

  async function sendMessage() {
    const content = input.trim();
    if (!content || loading) return;

    // 1️⃣ 先把用户消息压入 UI
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 2️⃣ 请求体
      const body: any = { message: content };
      if (sessionId) body.sessionId = sessionId;

      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('request failed');

      const data: {
        reply: string;
        sessionId: string;
      } = await res.json();

      // 3️⃣ 保存 sessionId
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // 4️⃣ 添加助手回复
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ **请求失败**，请稍后再试。'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="max-w-4xl mx-auto h-[calc(100vh-140px)]
                    bg-black/50 backdrop-blur rounded-xl
                    border border-white/10 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 text-orange-300 font-semibold">
        星洲智能助手
        {sessionId && (
          <span className="ml-2 text-xs text-gray-400">会话 {sessionId.slice(0, 8)}…</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && <div className="text-sm text-gray-400 italic">星洲正在思考中…</div>}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          placeholder="输入你的问题…（Enter 发送，Shift+Enter 换行）"
          className="flex-1 resize-none rounded-lg
                     bg-white/10 p-3 outline-none
                     focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="btn-primary disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
