import { ArrowLeftOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import type { UserInfo } from '../../../shared/types/user.types';



type ComplaintTopNavProps = {
  user: UserInfo | null;
  onBackHome: () => void;
  onLogout: () => void;
};

export default function ComplaintTopNav({
  user,
  onBackHome,
  onLogout,
}: ComplaintTopNavProps) {
  return (
    <header
      className="
        h-[70px] shrink-0
        bg-black/60 backdrop-blur
        border-b border-white/10
        px-6
        flex items-center justify-between
      "
    >
      {/* 左侧：用户信息 */}
      <div className="flex items-center gap-3 min-w-[220px]">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/10" />
        )}

        <span className="font-semibold text-orange-300">
          {user?.nickname || '加载中...'}
        </span>
      </div>

      {/* 中间标题 */}
      <h1 className="text-3xl font-bold text-orange-300">
        投诉与反馈
      </h1>

      {/* 右侧操作 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackHome}
          className="btn-primary "
        >
          <HomeIcon className="w-4 h-4" />
          返回主页
        </button>

        <button
          onClick={onLogout}
          className="
              flex items-center gap-2 rounded-full px-6 py-2.5
              text-base font-semibold
             bg-red-500/90 text-white hover:bg-red-500
              shadow-red-500/30 transition"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 " />
          退出
        </button>
      </div>
    </header>
  );
}
