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
        h-[70px]
        bg-[#121216]/90
        backdrop-blur-md
        border-b border-white/10
        shadow-[0_6px_20px_rgba(0,0,0,0.45)]
        px-6
        flex items-center
        z-50
      "
    >
      {/* 左侧：菜单 + 用户 */}
      <div className="flex items-center gap-3 text-gray-100 font-semibold">
        <button
          onClick={onToggleSidebar}
          className="
            p-2 rounded-lg
            text-gray-300
            hover:bg-white/10 hover:text-white
            transition
          "
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <UserAvatarMenu
          user={{
            nickname: user?.nickname || '星洲用户',
            avatar: user?.avatar,
          }}
          onEditAvatar={onEditAvatar}
        />
      </div>

      {/* 中间标题 */}
      <div className="flex-1 text-center pointer-events-none">
        <h1 className="text-lg font-semibold text-gray-200 tracking-wide"></h1>
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onLogout}
          className="
            px-4 py-1.5 rounded-full
            bg-red-500/80 hover:bg-red-500
            text-white text-sm font-medium
            border border-red-400/30
            shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
            transition
          "
        >
          退出
        </button>
      </div>
    </header>
  );
}
