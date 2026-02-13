import { useState, useEffect } from 'react';
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

// Asepal 动画总时长约 2.4s，加 3s 后收起 = 5.4s
const NICKNAME_AUTO_COLLAPSE_DELAY = 5400;

export default function TopNav({ user, onLogout, onEditAvatar, onToggleSidebar }: TopNavProps) {
  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();
  // 默认展开昵称
  const [showNickname, setShowNickname] = useState(true);

  const isAuthed = Boolean(user);

  const { t } = useTranslation('chat');

  void onLogout;
  void onEditAvatar;

  // 自动收起昵称：Asepal 动画完成后 3 秒
  useEffect(() => {
    if (!isAuthed) return;
    const timer = setTimeout(() => {
      setShowNickname(false);
    }, NICKNAME_AUTO_COLLAPSE_DELAY);
    return () => clearTimeout(timer);
  }, [isAuthed]);

  return (
    <header className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* 左侧：侧边栏 + 用户入口 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('tooltips.toggleSidebar')}
          title={t('tooltips.toggleSidebar')}
        >
          <Bars3Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {isAuthed ? (
          <button
            type="button"
            onClick={() => setShowNickname((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100/80 dark:bg-white/10 transition-colors"
            aria-expanded={showNickname}
            aria-label={t('tooltips.toggleNickname')}
            title={t('tooltips.toggleNickname')}
          >
            <img
              src={user!.avatar || DEFAULT_AVATAR}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/20"
              alt="user avatar"
            />
            <AnimatePresence initial={true}>
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
            aria-label={t('tooltips.login')}
            title={t('tooltips.login')}
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

        {/* Asepal 标题 - 组合动画 */}
        <div className="relative ml-2 flex flex-col items-start select-none">
          {/* 字母动画 */}
          <motion.h1
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex overflow-hidden"
            initial={{ letterSpacing: '0.3em', scale: 0.9 }}
            animate={{ letterSpacing: '0.05em', scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            {'Asepal'.split('').map((char, index) => {
              // 自定义延迟：首字母早，中间字母一起，末尾字母略晚
              const getDelay = () => {
                if (index === 0) return 0;
                if (index === 1) return 0.15;
                if (index >= 2 && index <= 4) return 0.15 + 0.35 + (index - 2) * 0.02;
                return 0.15 + 0.35 + (index - 4) * 0.1;
              };
              return (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: index >= 2 && index <= 4 ? '-30%' : '-100%',
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: getDelay(),
                    duration: index >= 2 && index <= 4 ? 0.15 : 0.35,
                    ease: 'easeOut',
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>

          {/* 下划线 - 从左绘入，从右消失 */}
          <motion.div
            className="h-[2px] bg-gray-900 dark:bg-gray-100 mt-0.5"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{
              scaleX: [0, 1, 1, 0],
              transformOrigin: ['left', 'left', 'right', 'right'],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.3, 0.7, 1],
              ease: 'easeInOut',
              delay: 0.8,
            }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="flex-1" />
    </header>
  );
}
