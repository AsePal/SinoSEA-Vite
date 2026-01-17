
type UserInfo = {
  nickname: string;
  figureurl: string;
};

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
    <header className="fixed top-0 left-0 right-0 h-17.5
                       bg-black/70 backdrop-blur border-b border-white/10
                       flex items-center justify-between px-6 z-50">
      {/* 左侧用户 */}
      <div className="flex items-center gap-3">
        {user?.figureurl ? (
          <img
            src={user.figureurl}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10" />
        )}
        <span className="font-semibold text-orange-300">
          {user?.nickname || '加载中...'}
        </span>
      </div>

      <h1 className="text-2xl font-bold bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
        欢迎！
      </h1>

      <div className="flex gap-3">
        <button  type="button"  className="btn-primary" onClick={onNewChat}>
          新对话
        </button>
        <button type="button" className=" rounded-full px-4 px-3 py-1.5 text-base font-semibold bg-red-500/90 text-white hover:bg-red-500 shadow-red-500/30 transition" onClick={onLogout}>
          退出
        </button>

      </div>
    </header>
  );
}
