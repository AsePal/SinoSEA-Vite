import { ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();

  function go(path: string) {
    navigate(path);
    onClose?.();
  }

  return (
    <aside
      className="
        h-full
        w-[260px]
        flex flex-col
        bg-white/80
        backdrop-blur-xl
        border-r border-white/30
        shadow-lg
        rounded-tr-2xl rounded-br-2xl
        text-gray-700
      "
    >
      {/* 主导航区 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        <h2 className="mb-4 text-center text-xl font-semibold tracking-widest text-gray-500">
          功能导航
        </h2>

        <MenuItem
          icon={CpuChipIcon}
          active
          onClick={() => {
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
      <div className="px-4 py-4 border-t border-black/5 text-sm">
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
        px-4 py-2.5 rounded-xl
        text-sm
        transition
        ${
          active
            ? 'bg-white/60 text-gray-900'
            : disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-white/50 hover:text-gray-900 cursor-pointer'
        }
      `}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <Icon className="w-5 h-5 shrink-0 opacity-80" />
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
        text-gray-500
        hover:bg-white/50 hover:text-gray-800
        transition
      "
    >
      {children}
    </button>
  );
}
