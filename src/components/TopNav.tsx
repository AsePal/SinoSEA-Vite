import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function TopNav() {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-17.5
                       bg-black/70 backdrop-blur border-b border-white/10
                       flex items-center justify-between px-6 z-50"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-orange-400 to-pink-500" />
        <span className="font-semibold text-orange-300">用户</span>
      </div>

      <h1 className="text-xl font-bold bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
        星洲智能助手
      </h1>

      <div className="flex gap-3">
        <button className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          新对话
        </button>

        <button className="btn-warn">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          退出
        </button>
      </div>
    </header>
  );
}
