import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserInfo } from '../../types/user.types';
import { useTranslation } from 'react-i18next';

export default function UserAvatarMenu({
  user,
  onEditAvatar,
}: {
  user: UserInfo;
  onEditAvatar: () => void;
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
          flex items-center gap-2 
          px-2 py-1
          rounded-full
         bg-white/30
         hover:bg-black/10
          transition
        "
      >
        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        <span className="font-semibold text-black/80 whitespace-nowrap">{user.nickname}</span>
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-white shadow-lg border z-[9999]"
          >
            <div className="px-4 py-4 border-b text-center">
              <img src={user.avatar} className="w-14 h-14 mx-auto rounded-full object-cover mb-2" />
              <div className="font-semibold text-gray-800">{user.nickname}</div>
              {/* 用户信息 */}
              <div className="text-xs text-gray-500 mt-1">{t('userMenu.profile')}</div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
