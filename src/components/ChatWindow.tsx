import { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../types/chat';
import { apiRequest } from '../utils/apiConfig';
import API from '../utils/apiConfig';


const CHAT_API = 'https://www.sionsea-ai.cn/chat';

export default function ChatWindow({
  userAvatar,
  userId,
}: {
  userAvatar?: string;
  userId?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const thinkingTimerRef = useRef<number | null>(null);

  // ⚠️ 只用于按钮 / 输入框，不参与消息逻辑
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sendingAnim, setSendingAnim] = useState(false);

  const [sendPhase, setSendPhase] =
    useState<'idle' | 'out' | 'return'>('idle');


  /*------------小飞机✈️图标触发逻辑------------ */
  function handleSend() {
    if (loading || !input.trim()) return;

    // 触发动画
    triggerSendAnimation();

    // 真正发消息
    sendMessage();
  }
  //触发动画
  function triggerSendAnimation() {
    if (sendPhase !== 'idle') return;

    setSendPhase('out');

    setTimeout(() => {
      setSendPhase('return');
    }, 600);

    setTimeout(() => {
      setSendPhase('idle');
    }, 1100);
  }


  /* ---------------- 输入框高度 ---------------- */

  function autoResizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function resetTextareaHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
  }
  /*--------------首次对话回复样式 ---------------------*/
  function getWelcomeMessage(): ChatMessage[] {
    return [
      {
        role: 'assistant',
        content: '你好呀！我是 **星洲智能助手** 🌟 有问题尽管问我😎'
      }
    ];
  }
  //触发欢迎语逐字回复
  function resetChat() {
    setMessages(getWelcomeMessage());
    setSessionId(null);

    // 逐字显示欢迎语
    const welcomeMessage = getWelcomeMessage();
    if (welcomeMessage && welcomeMessage.length > 0) {
      typeAssistantReply(welcomeMessage[0].content);
    }
  }


  /* ---------------- assistant 打字 ---------------- */

  function startThinkingAnimation() {
    let dots = 0;

    // 如果之前有动画，先停掉
    stopThinkingAnimation(); // 防止重复

    thinkingTimerRef.current = window.setInterval(() => {
      dots = (dots + 1) % 4;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (last && last.role === 'assistant') {
          last.content = `星洲正在思考⌛️${'.'.repeat(dots)}`;
        }

        return updated;
      });
    }, 300);
  }
  function stopThinkingAnimation() {
    if (thinkingTimerRef.current !== null) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
  }
  function typeAssistantReply(fullText: string) {
    let index = 0;

    // ⭐ 关键：先“立刻覆盖”思考文本
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        last.loading = false;
        last.content = '';
        last.typing = true;
      }
      return updated;
    });

    const timer = setInterval(() => {
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'assistant') {
          last.content = fullText.slice(0, index);
        }
        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(timer);

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last && last.role === 'assistant') {
            last.typing = false;
          }
          return updated;
        });
      }
    }, 18);
  }



  /* ---------------- 滚动 ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ---------------- 初始欢迎 ---------------- */

  useEffect(() => {
    const welcomeMessage = getWelcomeMessage();
    setMessages(welcomeMessage);

    // 逐字显示欢迎语
    if (welcomeMessage && welcomeMessage.length > 0) {
      typeAssistantReply(welcomeMessage[0].content);
    }
  }, []);

  /* ---------------- 发送消息 ---------------- */

  async function sendMessage() {

    const content = input.trim();
    if (!content || loading) return;

    setLoading(true);  // 设置为正在加载状态

    // 1️⃣ 用户消息
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setInput('');

    requestAnimationFrame(resetTextareaHeight);

    // 2️⃣ UI loading（按钮）
    setLoading(true);

    // 3️⃣ 插入 assistant loading 气泡（三个点）
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '星洲正在思考⌛️',

      }
    ]);
    startThinkingAnimation();


    try {
      const body: any = {
        message: content,
        userId, // 👈 昵称作为 userId
      };

      if (sessionId) {
        body.sessionId = sessionId;
      }


      const res = await apiRequest(API.chat.send, {
        method: 'POST',
        body,
      });


      if (!res.ok) throw new Error('request failed');

      const data: {
        reply: string;
        sessionId: string;
        userId?: string;
      } = await res.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // 4️⃣ 成功时，清除“思考中”动画并开始显示回复
      stopThinkingAnimation();
      typeAssistantReply(data.reply);
    } catch (err) {
      // ⏳ 模拟真实等待后再失败
      const delay = 1500 + Math.random() * 100;
      setTimeout(() => {
        stopThinkingAnimation();
        typeAssistantReply('❌ **出了点错误😢**，请稍后再试。');
      }, delay);
    } finally {
      setLoading(false);
    }
  }


  /* ---------------- UI ---------------- */

  return (
    <div className="w-full h-full bg-black/50 backdrop-blur rounded-xl border border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 text-orange-300 font-semibold">
        SionSEA-AI
        {sessionId && (
          <span className="ml-2 text-xs text-gray-400">
            会话 {sessionId.slice(0, 8)}…
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} userAvatar={userAvatar} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResizeTextarea();
          }}
          onPaste={() => requestAnimationFrame(autoResizeTextarea)}
          rows={1}
          placeholder="有什么能帮到你的呢？（Enter 发送，Shift+Enter 换行）"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 resize-none rounded-lg bg-white/10 p-3 outline-none
                     min-h-[44px] max-h-40 overflow-y-auto chat-scroll
                     transition-[height,box-shadow] duration-200
                     focus:shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
        />
        {/*发送按钮 */}
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="relative w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500
            flex items-center justify-center transition-colors disabled:opacity-40  
            isabled:cursor-not-allowedoverflow-hidden"
        >
          <PaperAirplaneIcon
            className={` w-5 h-5 text-white absolute transition-all duration-700 ease-in-out
                ${sendPhase === 'out'
                ? 'translate-x-24 translate-y-0 rotate-0 opacity-0'
                : sendPhase === 'return'
                  ? '-translate-x-16 translate-y-0 opacity-0'
                  : 'translate-x-0 translate-y-0 opacity-100'
              }
            `}
          />
        </button>


      </div>
    </div>
  );
}
