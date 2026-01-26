import { useNavigate } from 'react-router-dom';
import { CpuChipIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AboutHeader() {
  const navigate = useNavigate();

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        h-20
        bg-slate-900/90 backdrop-blur
        border-b border-white/10
      "
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* 左侧：图标 + 标题 */}
        <div className="flex items-center gap-4 text-white">
          <CpuChipIcon className="w-9 h-9 text-sky-400 shrink-0" />

          <div className="flex flex-col leading-tight">
            {/* 主标题 */}
            <span className="text-2xl font-bold tracking-wide">星洲智能科技</span>

            {/* 副标题 */}
            <span className="text-sm text-white/60 mt-0.5">让技术，终于抵达人心</span>
          </div>
        </div>

        {/* 右侧：退出按钮 */}
        <button
          onClick={() => navigate('/chat')}
          className="
            flex items-center gap-3
            px-6 py-3
            text-lg font-semibold
            rounded-full
            bg-rose-500 hover:bg-rose-600
            text-white
            transition
            shadow-lg
          "
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          退出
        </button>
      </div>
    </header>
  );
}
