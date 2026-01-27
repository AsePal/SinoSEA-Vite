import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';
import { UserAvatarMenu } from '../../../shared/components';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { div } from 'framer-motion/client';

type TopNavProps = {
  user: UserInfo | null;
  onLogout: () => void;
  onEditAvatar: () => void;
  onToggleSidebar: () => void;
};

export default function TopNav({ user, onLogout, onEditAvatar, onToggleSidebar }: TopNavProps) {
  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();
  const authed = Boolean(localStorage.getItem('auth_token'));

  console.log('[TopNav] user =', user);
  return (
    <header className="h-[64px] flex items-center px-4 md:px-6 relative z-20">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-black/10 transition">
          <Bars3Icon className="w-6 h-6" />
        </button>

        {user ? (
          <div>
            <UserAvatarMenu
              user={{
                nickname: user.nickname,
                avatar: user.avatar || DEFAULT_AVATAR,
              }}
              onEditAvatar={onEditAvatar}
            />
          </div>
        ) : (
          // 🔐 未登录：点击头像 → 跳转登录页
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
            <span className="text-sm text-gray-700 font-medium">登录 / 注册</span>
          </button>
        )}
      </div>

      <div className="flex-1" />

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        {authed && (
          <button
            type="button"
            onClick={onLogout}
            className="
        px-6 py-2 rounded-full
        text-sm font-medium text-white
        bg-gray-800
        hover:bg-red-500/90
        border border-red-400/30
        transition
      "
          >
            退出登录
          </button>
        )}
      </div>
    </header>
  );
}
