import { ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();

  function go(path: string) {
    navigate(path);
    onClose?.(); // ✅ 用掉 onClose，顺便实现“跳转后自动收起”
  }

  return (
    <aside
      className="
        w-72 h-full
        flex flex-col
        bg-[#232324]
        border-r border-white/20
        shadow-[8px_0_24px_rgba(0,0,0,0.4)]
        text-gray-200
      "
    >
      {/* 主导航区 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        <h2 className="mb-5 text-center text-sm font-semibold tracking-widest text-gray-200">
          功能导航
        </h2>

        <MenuItem
          icon={CpuChipIcon}
          active
          onClick={() => {
            // 如果你未来有明确路由（比如 /chat），可以改成 go('/chat')
            onClose?.();
          }}
        >
          询问星洲
        </MenuItem>

        <MenuItem icon={ChatBubbleLeftRightIcon} disabled>
          聊天室（敬请期待）
        </MenuItem>
      </div>

      {/* 底部功能区 */}
      <div className="px-4 py-4 border-t border-white/10 text-sm">
        <FooterButton onClick={() => go('/about')}>关于我们</FooterButton>
        <FooterButton onClick={() => go('/complaint')}>投诉反馈</FooterButton>
      </div>
    </aside>
  );
}

function MenuItem({
  icon: Icon,
  active,
  disabled,
  onClick,
  children,
}: {
  icon: any;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl
        text-sm
        transition
        ${
          active
            ? 'bg-white/10 text-white'
            : disabled
              ? 'text-gray-500 cursor-not-allowed'
              : 'hover:bg-white/5 hover:text-white cursor-pointer'
        }
      `}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function FooterButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left
        px-4 py-2 rounded-lg
        text-gray-400
        hover:bg-white/5 hover:text-gray-200
        transition
      "
    >
      {children}
    </button>
  );
}
