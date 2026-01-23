import type { UserInfo } from '../types/user';
import UserAvatarMenu from './UserAvatarMenu';


type TopNavProps = {
  user: UserInfo | null;
  onNewChat: () => void;
  onLogout: () => void;
};

export default function TopNav({
  user,
  onNewChat,
  onLogout,
}: TopNavProps) {
  return (
    <header
      className=" h-[70px] shrink-0 bg-black/60 backdrop-blur
        border-b border-white/10 px-6 flex items-center relative z-50 overflow-visible"
    >
      {/* 左侧用户 */}
      <div className="flex items-center min-w-[220px]">
        <UserAvatarMenu
          user={{
            nickname: user?.nickname || '星洲用户',
            avatarUrl: user?.avatar,
          }}
        />
      </div>


      {/* 中间欢迎语（真正居中） */}
      <div className="flex-1 text-center pointer-events-none">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          欢迎！
        </h1>
      </div>

      {/* 右侧按钮 */}
      <div className="flex items-center gap-3 min-w-[220px] justify-end">
        <button
          type="button"
          className="btn-primary"
          onClick={onNewChat}
        >
          新对话
        </button>

        <button
          type="button"
          className="
            rounded-full px-4 py-1.5
            text-base font-semibold
            bg-red-500/90 text-white
            hover:bg-red-500
            shadow-red-500/30 transition
          "
          onClick={onLogout}
        >
          退出
        </button>
      </div>
    </header>
  );
}
