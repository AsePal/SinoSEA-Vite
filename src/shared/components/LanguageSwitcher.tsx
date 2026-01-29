import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  variant?: 'light' | 'dark' | 'auto';
};

type Lang = 'zh-CN' | 'en-US' | 'vi-VN';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
];

export default function LanguageSwitcher({ variant = 'auto' }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDocDark, setIsDocDark] = useState(false);

  const [current, setCurrent] = useState(i18n.resolvedLanguage ?? i18n.language ?? 'zh-CN');

  const currentLang = LANGS.find((lang) =>
    current.startsWith(
      lang.code.startsWith('zh') ? 'zh' : lang.code.startsWith('vi') ? 'vi' : 'en',
    ),
  );

  useEffect(() => {
    const onChanged = (lng: string) => setCurrent(lng);
    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, [i18n]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDocDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isDark = variant === 'dark' || (variant === 'auto' && isDocDark);

  async function switchLang(lang: Lang) {
    const now = i18n.resolvedLanguage || i18n.language;
    if (now === lang) return;

    localStorage.setItem('lang', lang);
    await i18n.changeLanguage(lang);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* 下拉按钮 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-2
          px-3 py-1.5 rounded-lg
          text-sm font-medium
          transition
          ${
            isDark
              ? 'bg-black/30 text-white hover:bg-black/40'
              : 'bg-gray-200/80 text-gray-800 hover:bg-gray-200'
          }
        `}
      >
        {/* 语言选择样式 */}
        {/* <span>
          Language{currentLang && ` / ${currentLang.label}`}
        </span> */}
        <span>{currentLang && `  ${currentLang.label}`}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className={`
              absolute top-full mt-1 w-32 rounded-lg shadow-lg z-50
              ${isDark ? 'bg-gray-800 border border-white/10' : 'bg-gray-100 border border-gray-300'}
            `}
          >
            <div className="py-1">
              {LANGS.map((lang) => {
                const isActive = current.startsWith(
                  lang.code.startsWith('zh') ? 'zh' : lang.code.startsWith('vi') ? 'vi' : 'en',
                );
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => switchLang(lang.code)}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition
                      ${
                        isActive
                          ? isDark
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : isDark
                            ? 'text-white/70 hover:bg-white/10'
                            : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
