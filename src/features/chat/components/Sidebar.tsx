import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

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
      {/* 侧栏标题 */}
      <div className="px-4 py-5 border-b border-black/5">
        <h1 className="text-center text-2xl font-bold tracking-wide text-gray-800">Asepal</h1>
      </div>

      {/* 主导航区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {/* 功能导航下拉菜单 */}
        <DropdownMenu
          title="功能导航"
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* 询问星洲 */}
          <MenuItem
            icon={CpuChipIcon}
            active={location.pathname === '/chat'}
            onClick={() => go('/chat')}
          >
            {t('sidebar.ask')}
          </MenuItem>
          {/* 关于星洲 */}
          <MenuItem
            icon={InformationCircleIcon}
            active={location.pathname === '/landing'}
            onClick={() => go('/landing')}
          >
            {t('sidebar.about')}
          </MenuItem>
          {/* 关于我们 */}
          <MenuItem
            icon={InformationCircleIcon}
            active={location.pathname === '/about'}
            onClick={() => go('/about')}
          >
            {t('sidebar.aboutUs')}
          </MenuItem>
          {/* 投诉反馈 */}
          <MenuItem
            icon={ChatBubbleLeftRightIcon}
            active={location.pathname === '/chat/complaint'}
            onClick={() => go('/chat/complaint')}
          >
            {t('sidebar.feedback')}
          </MenuItem>
          {/* 聊天室（敬请期待） */}
          <MenuItem icon={ChatBubbleLeftRightIcon} disabled>
            {t('sidebar.chatroom')}
            <span className="ml-1 text-xs opacity-70">{t('sidebar.comingSoon')}</span>
          </MenuItem>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function DropdownMenu({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          px-3 py-2 rounded-lg
          text-sm font-medium text-gray-700
          hover:bg-white/50
          transition-colors
        "
      >
        <span>{title}</span>
        {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[600px] mt-1' : 'max-h-0'}
        `}
      >
        <div className="space-y-1">
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className={`
                transition-all duration-300 ease-out
                ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
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
