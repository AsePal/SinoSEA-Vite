import { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import MessageBubble from './MessageBubble';

///引入SSE
import type { ChatMessage, SSEEvent } from '../pages/Chat';
import { sendChatSSE } from '../utils/chatSSE';

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}



export default function ChatWindow({
  userAvatar,
  userId,
}: {
  userAvatar?: string;
  userId?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);






  // ⚠️ 只用于按钮 / 输入框，不参与消息逻辑
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type SendPhase = 'idle' | 'out' | 'reset' | 'return';
  const [sendPhase, setSendPhase] = useState<SendPhase>('reset');



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

    // 1️⃣ 向右飞走
    setSendPhase('out');

    // 2️⃣ 瞬移到左侧（无动画）
    setTimeout(() => {
      setSendPhase('reset');
    }, 400); // 与 out 动画时长一致

    // 3️⃣ 从左侧飞回
    setTimeout(() => {
      setSendPhase('return');
    }, 420); // 必须比 reset 稍晚一帧

    // 4️⃣ 回到稳定态
    setTimeout(() => {
      setSendPhase('idle');
    }, 900);
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
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '你好呀！我是 **星洲智能助手** 🌟 有问题尽管问我 😎',
      },
    ]);
  }, []);

  /* ---------------- 滚动 ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /*飞机入场动画*/
  useEffect(() => {
    // 页面初次进入：从左侧飞入
    requestAnimationFrame(() => {
      setSendPhase('return');
    });

    const t = setTimeout(() => {
      setSendPhase('idle');
    }, 600);

    return () => clearTimeout(t);
  }, []);

  /* ---------------- 发送消息 ---------------- */

  async function sendMessage() {
    let endReceived = false;
    let assistantText = '';

    const content = input.trim();
    if (!content || loading) return;

    setLoading(true);
    setInput('');
    requestAnimationFrame(resetTextareaHeight);

    // 1️⃣ 用户消息
    setMessages((prev) => [...prev, { role: 'user', content }]);

    // 2️⃣ 立刻创建 assistant 占位（思考中）
    const assistantMessageId = crypto.randomUUID();
    //let assistantText = '';

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '星洲正在思考⌛️',
        messageId: assistantMessageId,
      },
    ]);

    try {
      await sendChatSSE(
        {
          message: content,
          conversationId: conversationId ?? undefined,
          userId,
        },
        (event: SSEEvent) => {
          switch (event.type) {

            case 'delta': {
              assistantText += event.text;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.messageId === assistantMessageId
                    ? { ...msg, content: assistantText }
                    : msg
                )
              );
              break;
            }

            case 'end': {
              endReceived = true;
              setConversationId(event.conversationId);
              setLoading(false);
              break;
            }
          }
        }
      );
      // ⭐ 兜底判断：只有“完全没生成内容”才覆盖为错误
      if (!endReceived) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.messageId !== assistantMessageId) return msg;

            const alreadyHasText =
              assistantText.trim().length > 0 &&
              msg.content !== '星洲正在思考⌛️';

            // ✅ 已经有内容了：保留内容，只在末尾轻提示
            if (alreadyHasText) {
              return {
                ...msg,
                content: msg.content + '\n\n⚠️（本次生成结束信号可能丢失，但内容已完整显示）',
              };
            }

            // ❌ 没内容：才显示错误
            return {
              ...msg,
              content: '❌ 出现了点问题，请稍后再试。',
            };
          })
        );
        setLoading(false);
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.messageId !== assistantMessageId) return msg;

          const alreadyHasText =
            assistantText.trim().length > 0 &&
            msg.content !== '星洲正在思考⌛️';

          if (alreadyHasText) {
            return {
              ...msg,
              content: msg.content + '\n\n⚠️（连接中断，但内容已显示）',
            };
          }

          return {
            ...msg,
            content: '❌ 出现了点问题😢，请稍后再试。',
          };
        })
      );
      setLoading(false);
    }

  }





  /* ---------------- UI ---------------- */

  return (
    <div className=" w-full h-full bg-black/50 backdrop-blur
    rounded-lg md:rounded-xl
    border border-white/10
    flex flex-col
   "
    >
      {/* Header */}
      <div className=" p-3 md:p-4
          border-b border-white/10
         text-orange-300
          text-sm md:text-base
          font-semibold
        ">

        SionSEA-AI
        {conversationId && (
          <span className="ml-2 text-xs text-gray-400">
            会话 {conversationId.slice(0, 8)}…
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
      <div className="p-3 md:p-4 border-t border-white/10 flex gap-2">
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
            className={` absolute w-5 h-5 text-white

            ${sendPhase === 'reset'
                ? 'transition-none -translate-x-16 opacity-0'
                : 'transition-all duration-500 ease-in-out'
              }

             ${sendPhase === 'out'
                ? 'translate-x-32 opacity-0'
                : sendPhase === 'return'
                  ? 'translate-x-0 opacity-100'
                  : sendPhase === 'idle'
                    ? 'translate-x-0 opacity-100'
                    : ''
              }
            `}
          />
        </button>


      </div>
    </div>
  );
}
