import { useTranslation } from 'react-i18next';
import i18n from '../../shared/i18n';

const LANGUAGES = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
];

type Props = {
  variant?: 'light' | 'dark';
};

export default function LanguageSwitcher({ variant = 'light' }: Props) {
  const { i18n: i18nFromHook } = useTranslation();
  const current = i18nFromHook.language || 'zh-CN';

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center justify-center gap-2">
      {LANGUAGES.map((lang) => {
        const active = current.startsWith(lang.code);

        return (
          <button
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              localStorage.setItem('lang', lang.code);
            }}
            className={`
              px-4 py-1.5 rounded-full text-sm transition-all
              ${
                active
                  ? isDark
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : isDark
                    ? 'text-white/70 hover:bg-white/10'
                    : 'text-slate-500 hover:bg-slate-100'
              }
            `}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
