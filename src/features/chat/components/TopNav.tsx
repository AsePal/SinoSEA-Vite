import type { UserInfo } from '../../../shared/types/user.types';
import { UserAvatarMenu } from '../../../shared/components';
import { Bars3Icon } from '@heroicons/react/24/outline';

type TopNavProps = {
  user: UserInfo | null;
  onLogout: () => void;
  onEditAvatar: () => void;
  onToggleSidebar: () => void;
};

export default function TopNav({ user, onLogout, onEditAvatar, onToggleSidebar }: TopNavProps) {
  return (
    <header
      className="
        h-[64px]
        flex items-center
        px-4 md:px-6
        relative z-20  
        bg-transparent  
      "
    >
      {/* 左侧：菜单 + 用户 */}
      <div className="flex items-center gap-3 text-gray-900 font-medium">
        <button
          onClick={onToggleSidebar}
          className="
            p-2 rounded-lg
            text-gray-700
            hover:bg-black/10
            transition
          "
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <UserAvatarMenu
          user={{
            nickname: user?.nickname || '需要登录',
            avatar: user?.avatar,
          }}
          onEditAvatar={onEditAvatar}
        />
      </div>

      <div className="flex-1" />

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLogout}
          className="
            px-3 py-1.5 rounded-full
            text-sm font-medium text-white

            bg-red-500/70
            hover:bg-red-500/90

            border border-red-400/30
            transition
          "
        >
          退出
        </button>
      </div>
    </header>
  );
}
