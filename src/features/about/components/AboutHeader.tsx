import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AboutHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation('about');

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        h-20
        bg-slate-900/90 backdrop-blur
        border-b border-white/10
      "
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* 右侧：退出按钮 */}
        <button
          onClick={() => navigate('/chat')}
          className="
            flex items-center gap-3
            px-6 py-3
            text-lg font-semibold
            rounded-full
            bg-gray-500 hover:bg-rose-500
            text-white
            transition
            shadow-lg
          "
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {t('header.exit')}
        </button>
      </div>
    </header>
  );
}
