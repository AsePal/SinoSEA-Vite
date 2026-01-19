import { ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside
      className="
        w-72 shrink-0
        h-full
        flex flex-col
        bg-black/60 backdrop-blur
        border-r border-white/10
      "
    >
      {/* 中间可滚动区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <h2 className="text-orange-300 mb-4 text-center text-xl">
          功能导航
        </h2>

        <MenuItem icon={CpuChipIcon} active>
          询问星洲
        </MenuItem>

        <MenuItem icon={ChatBubbleLeftRightIcon}>
          聊天室
          (敬请期待)
        </MenuItem>
      </div>

      {/* 底部固定区域 */}
      <div className="px-4 py-3 border-t border-white/10 text-sm text-gray-400">
        <button 
        onClick={() => navigate('/about')}
        className="px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          关于我们
        </button>
        <button 
        onClick={() => navigate('/complaint')}
        className="px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
        
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
        text-sm
        ${active
          ? 'bg-orange-500/20 text-orange-400'
          : 'hover:bg-white/10 text-gray-200'}
      `}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {/* */}
      <span className='text-[18px]'>{children}</span>
    </div>
  );
}
