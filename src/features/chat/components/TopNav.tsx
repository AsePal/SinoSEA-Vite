import type { UserInfo } from '../../../shared/types/user.types';
import { UserAvatarMenu } from '../../../shared/components';
import { Bars3Icon } from '@heroicons/react/24/outline';

type TopNavProps = {
  user: UserInfo | null;
  onNewChat: () => void;
  onLogout: () => void;
  onEditAvatar: () => void;
  onToggleSidebar: () => void;
};

export default function TopNav({
  user,
  onNewChat,
  onLogout,
  onEditAvatar,
  onToggleSidebar,
}: TopNavProps) {
  return (
    <header
      className="
        h-[70px]
        bg-white/80
        backdrop-blur-sm
        border-b border-gray-200/60
        shadow-[0_4px_12px_rgba(0,0,0,0.06)]

        px-6
        flex items-center
        z-50
      "
    >
      {/* 左侧：保持原样不动 */}
      <div className="flex items-center gap-3 text-gray-900 font-semibold">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6 text-gray-800" />
        </button>

        {/* 用户昵称在 UserAvatarMenu 内部显示，
            这里通过外层 text-gray-900 font-semibold 统一加粗 */}
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
        <h1 className="text-xl font-bold text-gray-900">欢迎！</h1>
      </div>

      {/* 右侧：两个按钮加边框 + 阴影 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNewChat}
          className="
            btn-primary hidden sm:inline-flex
            text-white
            border border-blue-500/30
            shadow-sm
          "
        >
          新对话
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="
            rounded-full px-4 py-1.5
            bg-red-500 text-white hover:bg-red-600
            border border-red-600/30
            shadow-sm
            transition
          "
        >
          退出
        </button>
      </div>
    </header>
  );
}
