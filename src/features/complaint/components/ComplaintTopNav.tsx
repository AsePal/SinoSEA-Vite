import { ArrowLeftOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import type { UserInfo } from '../../../shared/types/user.types';

type ComplaintTopNavProps = {
  user: UserInfo | null;
  onBackHome: () => void;
  onLogout: () => void;
};

export default function ComplaintTopNav({ user, onBackHome, onLogout }: ComplaintTopNavProps) {
  return (
    <header
      className="
        h-16 shrink-0
        bg-black/60 backdrop-blur
        border-b border-white/10
        px-6
        flex items-center justify-between
      "
    >
      {/* 左侧：用户信息 */}
      <div className="flex items-center gap-3">
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/10" />
        )}

        <span className="font-semibold text-orange-300">{user?.nickname || '加载中...'}</span>
      </div>

      {/* 右侧：返回主页 */}
      <button onClick={onBackHome} className="btn-primary">
        <HomeIcon className="w-4 h-4" />
        返回主页
      </button>
    </header>
  );
}
