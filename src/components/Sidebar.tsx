import { ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <aside
      className="fixed
    top-16 bottom-0 left-0
    w-60
    bg-black/70 backdrop-blur
    border-r border-white/10
    hidden md:flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-orange-300 mb-4 text-center">功能导航</h2>

        <MenuItem icon={CpuChipIcon} active>
          询问星洲
        </MenuItem>

        <MenuItem icon={ChatBubbleLeftRightIcon}>
          聊天室
          <br />
          (敬请期待)
        </MenuItem>
      </div>

      {/* 底部区域 */}
      <div className="p-4 border-t border-white/10 space-y-2 text-sm text-gray-400">
        <div className="px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          关于我们
        </div>
        <div className="px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          投诉反馈
        </div>
      </div>
    </aside>
  );
}


function MenuItem({ icon: Icon, active, children }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${active ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/10'}`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </div>
  );
}
