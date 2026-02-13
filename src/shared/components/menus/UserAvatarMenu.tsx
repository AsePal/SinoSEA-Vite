import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserInfo } from '../../types/user.types';
import { useTranslation } from 'react-i18next';

export default function UserAvatarMenu({
  user,
  onEditAvatar,
  onLogout,
}: {
  user: UserInfo;
  onEditAvatar: () => void;
  onLogout?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('chat');

  // ⛔ 只有这个组件存在时，才注册全局事件
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* 头像按钮 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          ui-tooltip flex items-center gap-2 
          px-2 py-1
          rounded-full
         bg-gray-100/80 hover:bg-gray-200
         dark:bg-white/10 dark:hover:bg-white/20
          transition
        "
        aria-label={t('tooltips.openUserMenu')}
        data-tooltip={t('tooltips.openUserMenu')}
      >
        <img
          src={user.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/20"
        />
        <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
          {user.nickname}
        </span>
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-white shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700 z-[9999]"
          >
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 text-center">
              <img
                src={user.avatar}
                className="w-14 h-14 mx-auto rounded-full object-cover mb-2 ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div className="font-semibold text-gray-800 dark:text-gray-100">{user.nickname}</div>
              {/* 用户信息 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('userMenu.profile')}
              </div>
            </div>

            <div className="py-4 px-3">
              {/* 修改头像 */}
              <MenuItem
                label={t('userMenu.editAvatar')}
                onClick={() => {
                  setOpen(false);
                  onEditAvatar();
                }}
              />
              {/* 修改昵称 */}
              <MenuItem label={t('userMenu.editNickname')} />
              {/* 修改手机号 */}
              <MenuItem label={t('userMenu.editPhone')} />

              {/* 分割线 */}
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* 退出登录 */}
              {onLogout && (
                <MenuItem
                  label={t('topnav.logout')}
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-800 ${className || ''}`}
    >
      {label}
    </button>
  );
}
