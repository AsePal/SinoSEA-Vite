import { HomeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import type { UserInfo } from '../../../shared/types/user.types';

type ComplaintTopNavProps = {
  user: UserInfo | null;
  onBackHome: () => void;
  onLogout: () => void;
};

export default function ComplaintTopNav({ user, onBackHome }: ComplaintTopNavProps) {
  const { t } = useTranslation('complaint');

  return (
    <header
      className="
        h-14 shrink-0
        bg-white dark:bg-[#212121]
        border-b border-gray-200 dark:border-gray-700
        px-4 md:px-6
        flex items-center justify-between
      "
    >
      {/* 左侧：用户信息 */}
      <div className="flex items-center gap-2.5">
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user?.nickname || '加载中...'}
        </span>
      </div>

      {/* 右侧：返回主页 */}
      <button
        onClick={onBackHome}
        className="
          flex items-center gap-1.5
          px-3 py-1.5 rounded-lg
          text-sm font-medium
          text-gray-600 dark:text-gray-400
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors duration-200
        "
      >
        <HomeIcon className="w-4 h-4" />
        {t('topNav.backHome')}
      </button>
    </header>
  );
}
