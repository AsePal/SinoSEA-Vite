import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserInfo } from '../../../shared/types/user.types';
import { Bars3Icon } from '@heroicons/react/24/outline';

import { useTranslation } from 'react-i18next';

type TopNavProps = {
  user: UserInfo | null;
  onLogout: () => void;
  onEditAvatar: () => void;
  onToggleSidebar: () => void;
};

export default function TopNav({ user, onLogout, onEditAvatar, onToggleSidebar }: TopNavProps) {
  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();
  const [showNickname, setShowNickname] = useState(false);

  const isAuthed = Boolean(user);

  const { t } = useTranslation('chat');

  void onLogout;
  void onEditAvatar;

  return (
    <header className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* 左侧：侧边栏 + 用户入口 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Bars3Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {isAuthed ? (
          <button
            type="button"
            onClick={() => setShowNickname((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100/80 dark:bg-white/10 transition-colors"
            aria-expanded={showNickname}
          >
            <img
              src={user!.avatar || DEFAULT_AVATAR}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/20"
              alt="user avatar"
            />
            <AnimatePresence initial={false}>
              {showNickname && (
                <motion.span
                  key="nickname"
                  initial={{ maxWidth: 0, opacity: 0, x: -6 }}
                  animate={{ maxWidth: 140, opacity: 1, x: 0 }}
                  exit={{ maxWidth: 0, opacity: 0, x: -6 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap overflow-hidden"
                >
                  {user!.nickname}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              flex items-center gap-2
              px-2 py-1 
              rounded-full
              bg-white/40
              hover:bg-white/60
              transition
            "
          >
            <img
              src={DEFAULT_AVATAR}
              className="w-8 h-8 rounded-full object-cover"
              alt="default avatar"
            />
            {/* 注册登录 */}
            <span className="text-sm text-gray-700 font-medium">{t('topnav.login')}</span>
          </button>
        )}
      </div>

      <div className="flex-1" />
    </header>
  );
}
