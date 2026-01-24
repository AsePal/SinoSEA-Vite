import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_DELAY = 0.1;
const STEP = 0.2;

/** 滚动进入动画 Hook */
function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function Landing() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const problem = useReveal();
  const features = useReveal();
  const belief = useReveal();

  /** 点击按钮 → 页面淡出 → 跳转 */
  const handleStart = () => {
    setLeaving(true);
    setTimeout(() => {
      navigate('/login');
    }, 400);
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-gradient-to-br
        from-sky-50 via-white to-blue-100
        ${leaving ? 'animate-fade-out-down' : ''}
      `}
    >
      {/* ===== Hero 首屏 ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">

        <h1
          className="text-5xl md:text-6xl font-semibold tracking-tight text-blue-600 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY}s` }}
        >
          SionSEA-AI
        </h1>

        <p
          className="mt-4 text-xl text-slate-700 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP}s` }}
        >
          星洲智能助手
        </p>

        <p
          className="mt-10 text-lg text-slate-600 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 2}s` }}
        >
          为来到中国的东盟留学生
        </p>

        <p
          className="text-lg text-slate-600 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 3}s` }}
        >
          提供制度指引、校园适应与心理陪伴
        </p>

        <p
          className="text-lg text-slate-600 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 4}s` }}
        >
          的智能助手
        </p>

        <button
          onClick={handleStart}
          className="
            mt-12 px-10 py-4 rounded-full
            bg-blue-600 text-white text-lg font-medium
            shadow-lg shadow-blue-300/40
            hover:bg-blue-700 hover:scale-105
            transition-all
            animate-slide-up
          "
          style={{ animationDelay: `${BASE_DELAY + STEP * 6}s` }}
        >
          让我们开始吧
        </button>
      </section>

      {/* ===== Section 1：问题共鸣 ===== */}
      <section
        ref={problem.ref}
        className="py-28 px-6 bg-white"
      >
        <div
          className={`
            max-w-4xl mx-auto text-center space-y-6
            ${problem.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <h2 className="text-3xl font-bold text-slate-900">
            来到一个陌生的国家，本就不该独自摸索
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            语言差异、制度不熟悉、校园环境陌生，
            都可能在无形中增加压力。
            <br />
            我们希望，把这些不确定，变成可以被理解的事情。
          </p>
        </div>
      </section>

      {/* ===== Section 2：功能 ===== */}
      <section
        ref={features.ref}
        className="py-28 px-6 bg-slate-50"
      >
        <div
          className={`
            max-w-6xl mx-auto
            ${features.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-14">
            我们能为你做什么
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              ['规章制度智能解答', '用你熟悉的语言理解规则'],
              ['校园与周边生活推荐', '一步步熟悉你所在的城市'],
              ['心理支持与陪伴', '当你感到焦虑与孤独时'],
              ['多语言智能问答', '更贴合东盟留学生背景'],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 3：理念 ===== */}
      <section
        ref={belief.ref}
        className="py-24 px-6 bg-white"
      >
        <div
          className={`
            max-w-3xl mx-auto text-center
            ${belief.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <p className="text-xl font-medium text-slate-800">
            我们相信，技术不只是工具，
            <br />
            而是在陌生环境中，给予人安全感的陪伴。
          </p>
        </div>
      </section>
    </div>
  );
}
