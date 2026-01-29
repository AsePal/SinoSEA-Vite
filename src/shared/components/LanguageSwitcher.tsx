import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  variant?: 'light' | 'dark';
};

type Lang = 'zh-CN' | 'en-US' | 'vi-VN';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
];

export default function LanguageSwitcher({ variant = 'light' }: Props) {
  const { i18n } = useTranslation();

  const [current, setCurrent] = useState(i18n.resolvedLanguage ?? i18n.language ?? 'zh-CN');

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

    localStorage.setItem('lang', lang);
    await i18n.changeLanguage(lang);
  }

  return (
    <div
      className={[
        'flex items-center gap-1 rounded-full px-1 py-1',
        isDark ? 'bg-black/30' : 'bg-white/70',
      ].join(' ')}
    >
      {LANGS.map((lang) => {
        const active = current.startsWith(
          lang.code.startsWith('zh') ? 'zh' : lang.code.startsWith('vi') ? 'vi' : 'en',
        );
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
