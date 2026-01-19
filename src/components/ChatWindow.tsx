import { use, useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../types/chat';

const CHAT_API = 'http://api.sionsea-ai.cn:3000/chat';

export default function ChatWindow({
  userAvatar
}: {
  userAvatar?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);



  function autoResizeTextarea() {
  const el = textareaRef.current;
  if (!el) return;

  el.style.height = 'auto';              // 关键：先重置
  el.style.height = el.scrollHeight + 'px';
}
  function resetTextareaHeight() {
  const el = textareaRef.current;
  if (!el) return;

  el.style.height = 'auto';
}




  /** 自动滚动到底部 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /** 首次欢迎语 */
function getWelcomeMessage(): ChatMessage[] {
  return [
    {
      role: 'assistant',
      content: '你好呀！我是**星洲智能助手** 🌟有问题，请尽管问我！😎'
    }
  ];
}
useEffect(() => {
  setMessages(getWelcomeMessage());
}, []);
function resetChat() {
  setMessages(getWelcomeMessage());
  setSessionId(null);
}
{messages.map((msg, i) => (
  <MessageBubble
    key={i}
    message={msg}
    userAvatar={userAvatar}
  />
))}



  async function sendMessage() {
    const content = input.trim();
    if (!content || loading) return;

    // 1️⃣ 先把用户消息压入 UI
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    requestAnimationFrame(() => {
      resetTextareaHeight();
    });


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
          content: '❌ **出了点错误😢**，请稍后再试。'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full h-full
                bg-black/50 backdrop-blur
                rounded-xl border border-white/10
                flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 text-orange-300 font-semibold">
        SionSEA-AI
        {sessionId && (
          <span className="ml-2 text-xs text-gray-400">会话 {sessionId.slice(0, 8)}…</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
        ))}

        {loading && <div className="text-sm text-gray-400 italic">
          星洲正在思考中…
          </div>}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2 chat-scroll">
        <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          autoResizeTextarea();
        }}
        onInput={autoResizeTextarea}
        onPaste={() => {
          requestAnimationFrame(autoResizeTextarea);
        }}
        rows={1}
        placeholder="有什么能帮到你的呢？（Enter 发送，Shift+Enter 换行）"
        className="flex-1 resize-none rounded-lg bg-white/10 p-3 outline-none
          min-h-[44px] max-h-40 overflow-y-auto transition-[height,box-shadow] duration-200 ease-out
          focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="btn-primary transition-transform duration-100 active:scale-90
         disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
          <PaperAirplaneIcon className="w-5 h-5 animate-spin" />
        ) : (
          <PaperAirplaneIcon className="w-5 h-5" />
        )}

        </button>
      </div>
    </div>
  );
}


