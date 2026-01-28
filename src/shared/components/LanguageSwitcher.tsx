import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  variant?: 'light' | 'dark';
};

type Lang = 'zh-CN' | 'en-US';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
];

export default function LanguageSwitcher({ variant = 'light' }: Props) {
  // ✅ 永远用 hook 拿到的 i18n（不要自己 import i18n 实例）
  const { i18n } = useTranslation();

  // ✅ 用本地 state 强制跟随 languageChanged（即使父页面没用 t() 也能刷新）
  const [current, setCurrent] = useState<string>(i18n.resolvedLanguage || i18n.language || 'zh-CN');

  useEffect(() => {
    const onChanged = (lng: string) => setCurrent(lng);
    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, [i18n]);

  const isDark = variant === 'dark';

  async function switchLang(lang: Lang) {
    const now = i18n.resolvedLanguage || i18n.language;
    if (now === lang) return;

    // 先落盘，刷新也能保持
    localStorage.setItem('lang', lang);

    // ✅ 等待 changeLanguage 完成，避免你看到“after 还是旧语言”的假象
    await i18n.changeLanguage(lang);
    // state 会在 languageChanged 事件里更新，这里不强行 setCurrent 也行
  }

  return (
    <div
      className={[
        'flex items-center gap-1 rounded-full px-1 py-1',
        isDark ? 'bg-black/30' : 'bg-white/70',
      ].join(' ')}
    >
      {LANGS.map((lang) => {
        const active = (current || '').startsWith(lang.code.startsWith('zh') ? 'zh' : 'en');
        const base = 'px-3 py-1 rounded-full text-sm transition';

        const activeCls = isDark ? 'bg-white text-black' : 'bg-blue-600 text-white';
        const idleCls = isDark
          ? 'text-white/70 hover:bg-white/10'
          : 'text-gray-500 hover:bg-slate-100';

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => switchLang(lang.code)}
            className={[base, active ? activeCls : idleCls].join(' ')}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
