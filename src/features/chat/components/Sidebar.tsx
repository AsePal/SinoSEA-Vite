import { ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();

  return (
    <aside
      className="
        w-72 h-full
        flex flex-col
        bg-white/80
        backdrop-blur-sm
        shadow-[4px_0_16px_rgba(0,0,0,0.06)]
      "
    >
      {/* 主导航区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">功能导航</h2>

        <MenuItem icon={CpuChipIcon} active>
          询问星洲
        </MenuItem>

        <MenuItem icon={ChatBubbleLeftRightIcon}>聊天室（敬请期待）</MenuItem>
      </div>

      {/* 底部功能区：结构白 */}
      <div className="px-4 py-3 bg-white/60 border-t border-gray-200/60 text-sm text-gray-600">
        <button
          onClick={() => navigate('/about')}
          className="
            px-4 py-2 rounded-lg
            hover:bg-gray-100/70
            w-full text-left
            transition
          "
        >
          关于我们
        </button>
        <button
          onClick={() => navigate('/complaint')}
          className="
            px-4 py-2 rounded-lg
            hover:bg-gray-100/70
            w-full text-left
            transition
          "
        >
          投诉反馈
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon: Icon, active, children }: any) {
  return (
    <div
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-lg cursor-pointer
        text-base
        transition
        ${active ? 'bg-blue-50/80 text-blue-600' : 'hover:bg-gray-100/70 text-gray-800'}
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </div>
  );
}
