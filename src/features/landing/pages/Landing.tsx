import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AboutContent from '../../about/components/AboutContent';
import AboutFooter from '../../about/components/AboutFooter';

const BASE_DELAY = 0.1;
const STEP = 0.2;

type FeatureItem = {
  title: string;
  desc: string;
};

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
      { threshold: 0.2 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function Landing() {
  const navigate = useNavigate();
  const { t: tLanding } = useTranslation('landing');
  const { t: tAbout } = useTranslation('about');
  const [leaving, setLeaving] = useState(false);

  const problem = useReveal();
  const features = useReveal();
  const belief = useReveal();

  const handleStart = () => {
    setLeaving(true);
    setTimeout(() => {
      navigate('/login');
    }, 400);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  const navItems = [
    { id: 'hero', label: 'Asepal' },
    { id: 'problem', label: '问题共鸣' },
    { id: 'features', label: '我们能做什么' },
    { id: 'belief', label: '理念' },
    { id: 'about-us', label: tAbout('aboutUs.title') },
    { id: 'team', label: tAbout('team.title') },
    { id: 'project', label: tAbout('project.title') },
  ];

  // ✅ 安全获取 features.items
  const featureItems = (tLanding('features.items', { returnObjects: true }) as FeatureItem[]) ?? [];

  return (
    <div
      className={`
        w-full min-h-full
        bg-gradient-to-br from-sky-50 via-white to-blue-100
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        ${leaving ? 'animate-fade-out-down' : ''}
      `}
    >
      {/* ===== Landing Top Nav ===== */}
      <div className="fixed top-14 left-0 right-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 py-2.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="text-xs md:text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 占位，防止 fixed 导航遮挡内容 */}
      <div className="h-10" />

      {/* ===== Hero ===== */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 scroll-mt-28"
      >
        <h1
          className="text-5xl md:text-6xl font-semibold tracking-tight text-blue-600 dark:text-blue-400 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY}s` }}
        >
          Asepal
        </h1>

        <p
          className="mt-4 text-xl text-slate-700 dark:text-gray-300 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP}s` }}
        >
          {tLanding('hero.subtitle')}
        </p>

        <p
          className="mt-10 text-lg text-slate-600 dark:text-gray-400 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 2}s` }}
        >
          {tLanding('hero.line1')}
        </p>

        <p
          className="text-lg text-slate-600 dark:text-gray-400 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 3}s` }}
        >
          {tLanding('hero.line2')}
        </p>

        <p
          className="text-lg text-slate-600 dark:text-gray-400 animate-slide-up"
          style={{ animationDelay: `${BASE_DELAY + STEP * 4}s` }}
        >
          {tLanding('hero.line3')}
        </p>

        <div className="flex flex-col items-center gap-4 mt-3">
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
            {tLanding('hero.start')}
          </button>
        </div>
      </section>

      {/* ===== 问题共鸣 ===== */}
      <section
        id="problem"
        ref={problem.ref}
        className="py-28 px-6 bg-white dark:bg-gray-800 scroll-mt-28"
      >
        <div
          className={`
            max-w-4xl mx-auto text-center space-y-6
            ${problem.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-100">
            {tLanding('problem.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
            {tLanding('problem.desc1')}
            <br />
            {tLanding('problem.desc2')}
          </p>
        </div>
      </section>

      {/* ===== 功能 ===== */}
      <section
        id="features"
        ref={features.ref}
        className="py-28 px-6 bg-slate-50 dark:bg-gray-900 scroll-mt-28"
      >
        <div
          className={`
            max-w-6xl mx-auto
            ${features.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-gray-100 mb-14">
            {tLanding('features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(featureItems) &&
              featureItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-200 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ===== 理念 ===== */}
      <section
        id="belief"
        ref={belief.ref}
        className="py-24 px-6 bg-white dark:bg-gray-800 scroll-mt-28"
      >
        <div
          className={`
            max-w-3xl mx-auto text-center
            ${belief.visible ? 'animate-slide-up' : 'opacity-0'}
          `}
        >
          <p className="text-xl font-medium text-slate-800 dark:text-gray-200">
            {tLanding('belief.line1')}
            <br />
            {tLanding('belief.line2')}
          </p>
        </div>
      </section>

      {/* ===== About & About Us ===== */}
      <AboutContent />
      <AboutFooter />
    </div>
  );
}
